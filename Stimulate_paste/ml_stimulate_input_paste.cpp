#include <windows.h>
#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <vector>
#include <atomic>
#include <shellapi.h>
#include <cstdlib>
#include <limits>
#include <conio.h>

struct TypingStats {
    size_t sentUnits = 0;
    size_t sendFailures = 0;
    size_t skippedInvalidSurrogates = 0;
    size_t interrupted = 0;
};

std::atomic<bool> g_stopRequested{ false };

BOOL WINAPI CtrlHandler(DWORD signal) {
    if (signal == CTRL_C_EVENT || signal == CTRL_BREAK_EVENT) {
        g_stopRequested = true;
        return TRUE;
    }

    return FALSE;
}

bool IsHighSurrogate(wchar_t c) {
    return c >= 0xD800 && c <= 0xDBFF;
}

bool IsLowSurrogate(wchar_t c) {
    return c >= 0xDC00 && c <= 0xDFFF;
}

bool SendUnicodeUnit(wchar_t unit) {
    INPUT inputs[2] = {};

    inputs[0].type = INPUT_KEYBOARD;
    inputs[0].ki.wScan = unit;
    inputs[0].ki.dwFlags = KEYEVENTF_UNICODE;

    inputs[1].type = INPUT_KEYBOARD;
    inputs[1].ki.wScan = unit;
    inputs[1].ki.dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP;

    UINT sent = SendInput(2, inputs, sizeof(INPUT));
    if (sent != 2) {
        std::cerr << "SendInput(unicode) failed. Sent=" << sent
                  << ", GetLastError=" << GetLastError() << std::endl;
        return false;
    }

    return true;
}

bool SendVirtualKey(WORD vk) {
    INPUT inputs[2] = {};

    inputs[0].type = INPUT_KEYBOARD;
    inputs[0].ki.wVk = vk;

    inputs[1].type = INPUT_KEYBOARD;
    inputs[1].ki.wVk = vk;
    inputs[1].ki.dwFlags = KEYEVENTF_KEYUP;

    UINT sent = SendInput(2, inputs, sizeof(INPUT));
    if (sent != 2) {
        std::cerr << "SendInput(vk=" << vk << ") failed. Sent=" << sent
                  << ", GetLastError=" << GetLastError() << std::endl;
        return false;
    }

    return true;
}

DWORD GetProcessIntegrityRid(HANDLE process) {
    HANDLE token = nullptr;
    if (!OpenProcessToken(process, TOKEN_QUERY, &token)) {
        return 0;
    }

    DWORD needed = 0;
    GetTokenInformation(token, TokenIntegrityLevel, nullptr, 0, &needed);
    if (needed == 0) {
        CloseHandle(token);
        return 0;
    }

    std::vector<BYTE> buffer(needed);
    if (!GetTokenInformation(token, TokenIntegrityLevel, buffer.data(), needed, &needed)) {
        CloseHandle(token);
        return 0;
    }

    auto* label = reinterpret_cast<TOKEN_MANDATORY_LABEL*>(buffer.data());
    DWORD rid = *GetSidSubAuthority(
        label->Label.Sid,
        static_cast<DWORD>(*GetSidSubAuthorityCount(label->Label.Sid) - 1));

    CloseHandle(token);
    return rid;
}

void WaitForEnter() {
    std::cout << "Press Enter to continue . . .";

    for (;;) {
        if (g_stopRequested.load()) {
            std::cout << "\nStop requested (Ctrl+C). Exiting..." << std::endl;
            std::exit(0);
        }

        if (_kbhit()) {
            int ch = _getch();
            if (ch == '\r' || ch == '\n') {
                std::cout << std::endl;
                return;
            }
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
}

std::wstring QuoteArgForCommandLine(const std::wstring& arg) {
    if (arg.empty()) {
        return L"\"\"";
    }

    if (arg.find_first_of(L" \t\"") == std::wstring::npos) {
        return arg;
    }

    std::wstring quoted = L"\"";
    size_t backslashCount = 0;

    for (wchar_t ch : arg) {
        if (ch == L'\\') {
            ++backslashCount;
            continue;
        }

        if (ch == L'\"') {
            quoted.append(backslashCount * 2 + 1, L'\\');
            quoted += L'\"';
            backslashCount = 0;
            continue;
        }

        if (backslashCount > 0) {
            quoted.append(backslashCount, L'\\');
            backslashCount = 0;
        }

        quoted += ch;
    }

    if (backslashCount > 0) {
        quoted.append(backslashCount * 2, L'\\');
    }

    quoted += L"\"";
    return quoted;
}

std::wstring BuildRelaunchParameters() {
    int argc = 0;
    LPWSTR* argv = CommandLineToArgvW(GetCommandLineW(), &argc);
    if (!argv || argc <= 1) {
        if (argv) {
            LocalFree(argv);
        }
        return L"";
    }

    std::wstring params;
    for (int i = 1; i < argc; ++i) {
        if (!params.empty()) {
            params += L" ";
        }
        params += QuoteArgForCommandLine(argv[i]);
    }

    LocalFree(argv);
    return params;
}

void RelaunchAsAdminOrExit() {
    BOOL isAdmin = FALSE;
    PSID adminGroup = nullptr;
    SID_IDENTIFIER_AUTHORITY ntAuthority = SECURITY_NT_AUTHORITY;

    if (AllocateAndInitializeSid(&ntAuthority,
                                 2,
                                 SECURITY_BUILTIN_DOMAIN_RID,
                                 DOMAIN_ALIAS_RID_ADMINS,
                                 0, 0, 0, 0, 0, 0,
                                 &adminGroup)) {
        CheckTokenMembership(nullptr, adminGroup, &isAdmin);
        FreeSid(adminGroup);
    }

    if (isAdmin) {
        return;
    }

    wchar_t exePath[MAX_PATH] = {};
    DWORD exePathLen = GetModuleFileNameW(nullptr, exePath, MAX_PATH);
    if (exePathLen == 0) {
        std::cerr << "Failed to get executable path. GetLastError=" << GetLastError() << std::endl;
        std::exit(1);
    }
    if (exePathLen >= MAX_PATH) {
        std::cerr << "Executable path is too long for relaunch." << std::endl;
        std::exit(1);
    }

    std::wstring parameters = BuildRelaunchParameters();
    HINSTANCE result = ShellExecuteW(nullptr, L"runas", exePath,
                                     parameters.empty() ? nullptr : parameters.c_str(),
                                     nullptr, SW_SHOWNORMAL);
    if (reinterpret_cast<INT_PTR>(result) <= 32) {
        std::cerr << "Failed to relaunch as administrator. ShellExecuteW code="
                  << reinterpret_cast<INT_PTR>(result) << std::endl;
        std::exit(1);
    }

    std::exit(0);
}

void PrintUipiWarningForForegroundWindow() {
    HWND foreground = GetForegroundWindow();
    if (!foreground) {
        return;
    }

    DWORD targetPid = 0;
    GetWindowThreadProcessId(foreground, &targetPid);
    if (targetPid == 0 || targetPid == GetCurrentProcessId()) {
        return;
    }

    HANDLE targetProcess = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, FALSE, targetPid);
    if (!targetProcess) {
        return;
    }

    DWORD currentRid = GetProcessIntegrityRid(GetCurrentProcess());
    DWORD targetRid = GetProcessIntegrityRid(targetProcess);
    CloseHandle(targetProcess);

    if (currentRid != 0 && targetRid != 0 && targetRid > currentRid) {
        std::cerr << "Warning: Foreground window appears to run at higher integrity than this process. "
                  << "SendInput may be blocked by UIPI." << std::endl;
    }
}

// Function to get text from clipboard
std::wstring GetClipboardText() {
    constexpr int kMaxOpenAttempts = 10;
    constexpr int kOpenRetrySleepMs = 30;

    bool opened = false;
    DWORD lastError = 0;

    for (int attempt = 1; attempt <= kMaxOpenAttempts; ++attempt) {
        if (OpenClipboard(nullptr)) {
            opened = true;
            break;
        }

        lastError = GetLastError();
        std::this_thread::sleep_for(std::chrono::milliseconds(kOpenRetrySleepMs));
    }

    if (!opened) {
        std::cerr << "Failed to open clipboard after " << kMaxOpenAttempts
                  << " attempts. GetLastError=" << lastError << std::endl;
        return L"";
    }

    HANDLE hData = GetClipboardData(CF_UNICODETEXT);
    if (hData == nullptr) {
        std::cerr << "Failed to get clipboard data. GetLastError=" << GetLastError() << std::endl;
        CloseClipboard();
        return L"";
    }

    wchar_t* pszText = static_cast<wchar_t*>(GlobalLock(hData));
    if (pszText == nullptr) {
        std::cerr << "Failed to lock clipboard data. GetLastError=" << GetLastError() << std::endl;
        CloseClipboard();
        return L"";
    }

    std::wstring text(pszText);

    GlobalUnlock(hData);
    CloseClipboard();

    return text;
}

// Function to simulate typing text
TypingStats SimulateTyping(const std::wstring& text) {
    TypingStats stats;

    for (size_t i = 0; i < text.size(); ++i) {
        if (g_stopRequested.load()) {
            stats.interrupted = 1;
            break;
        }

        wchar_t c = text[i];

        // Normalize any newline form to a real Enter key event.
        if (c == L'\r') {
            if (i + 1 < text.size() && text[i + 1] == L'\n') {
                ++i; // consume LF in CRLF
            }

            if (SendVirtualKey(VK_RETURN)) {
                ++stats.sentUnits;
            } else {
                ++stats.sendFailures;
            }

            std::this_thread::sleep_for(std::chrono::milliseconds(10));
            continue;
        }

        if (c == L'\n') {
            if (SendVirtualKey(VK_RETURN)) {
                ++stats.sentUnits;
            } else {
                ++stats.sendFailures;
            }

            std::this_thread::sleep_for(std::chrono::milliseconds(10));
            continue;
        }

        // Handle UTF-16 surrogate pairs safely.
        if (IsHighSurrogate(c)) {
            if (i + 1 < text.size() && IsLowSurrogate(text[i + 1])) {
                wchar_t low = text[i + 1];
                bool highOk = SendUnicodeUnit(c);
                bool lowOk = SendUnicodeUnit(low);

                if (highOk) {
                    ++stats.sentUnits;
                } else {
                    ++stats.sendFailures;
                }

                if (lowOk) {
                    ++stats.sentUnits;
                } else {
                    ++stats.sendFailures;
                }

                ++i; // consumed low surrogate too
                std::this_thread::sleep_for(std::chrono::milliseconds(10));
                continue;
            }

            ++stats.skippedInvalidSurrogates;
            std::wcerr << L"Warning: Skipping orphan high surrogate at index " << i << L"." << std::endl;
            continue;
        }

        if (IsLowSurrogate(c)) {
            ++stats.skippedInvalidSurrogates;
            std::wcerr << L"Warning: Skipping orphan low surrogate at index " << i << L"." << std::endl;
            continue;
        }

        if (SendUnicodeUnit(c)) {
            ++stats.sentUnits;
        } else {
            ++stats.sendFailures;
        }

        // Small delay between keystrokes to mimic natural typing and prevent buffer overflow
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }

    return stats;
}

int main() {
    RelaunchAsAdminOrExit();

    // Set console output code page to UTF-8 for better character support in console
    SetConsoleOutputCP(CP_UTF8);

    if (!SetConsoleCtrlHandler(CtrlHandler, TRUE)) {
        std::cerr << "Warning: Failed to register Ctrl+C handler. GetLastError="
                  << GetLastError() << std::endl;
    }

    std::cout << "Author: Midairlogn (https://github.com/midairlogn)" << std::endl << std::endl;

    std::cout << "Copy the text you want to paste, then press Enter." << std::endl;
    WaitForEnter();
    std::cout << std::endl;

    std::cout << "Reading content from clipboard..." << std::endl;
    std::wstring clipboardText = GetClipboardText();

    if (clipboardText.empty()) {
        std::cout << "Clipboard is empty or does not contain text." << std::endl;
        WaitForEnter();
        return 1;
    }

    std::wcout << L"Clipboard content length: " << clipboardText.length() << std::endl;

    // Informational preflight only: SendInput may be blocked across integrity levels.
    PrintUipiWarningForForegroundWindow();

    std::cout << "Click the target window/input field, then press Enter to start the countdown." << std::endl;
    WaitForEnter();
    std::cout << "You have 5 seconds to switch to the target window/field..." << std::endl;

    for (int i = 5; i > 0; --i) {
        if (g_stopRequested.load()) {
            std::cout << "Countdown interrupted by Ctrl+C." << std::endl;
            return 0;
        }

        std::cout << i << "..." << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }

    std::cout << "Starting input simulation..." << std::endl;
    TypingStats stats = SimulateTyping(clipboardText);
    std::cout << "Done. Sent units: " << stats.sentUnits
              << ", failures: " << stats.sendFailures
              << ", skipped invalid UTF-16 units: " << stats.skippedInvalidSurrogates
              << std::endl;

    if (stats.interrupted) {
        std::cout << "Simulation interrupted by Ctrl+C." << std::endl;
    }

    WaitForEnter();

    return 0;
}
