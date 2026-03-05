# Stimulate Paste

`ml_stimulate_input_paste.cpp` 是一个 Windows 控制台工具：
- 从剪贴板读取 Unicode 文本（`CF_UNICODETEXT`）
- 倒计时后通过 `SendInput` 模拟逐字输入
- 支持回车换行处理（`\r` / `\n` / `\r\n`）
- 处理 UTF-16 代理对（surrogate pair）
- 支持 `Ctrl + C` 中断

> 注意：该程序会请求管理员权限（`runas`），并且依赖 Windows 输入模拟机制。请仅在你有权限控制的目标窗口中使用。

## 文件说明

- 源码：`ml_stimulate_input_paste.cpp`
- 入口函数：`main`
- 关键能力：
  - 剪贴板读取：`GetClipboardText`
  - 输入模拟：`SimulateTyping`、`SendUnicodeUnit`、`SendVirtualKey`
  - 管理员重启：`RelaunchAsAdminOrExit`
  - 完整性级别提示（UIPI）：`PrintUipiWarningForForegroundWindow`

## 环境要求

- Windows 10/11
- C++17（或兼容）编译器
- Win32 API（`windows.h`, `shellapi.h` 等）

## 使用步骤

1. 编译并运行。
2. 程序若非管理员权限会自动提权重启。
3. 按提示先复制要“粘贴”的文本到剪贴板。
4. 在控制台按一次 `Enter`，程序读取剪贴板内容。
5. 切换到目标输入框后，回到控制台按 `Enter` 启动 `5s` 倒计时。
6. 倒计时结束后程序开始模拟输入。
7. 过程中可按 `Ctrl + C` 请求中断。

## 常见问题

### 1) 没有任何输入发生

- 请确认目标窗口在倒计时后获得焦点。
- 某些程序/安全软件会拦截模拟输入。
- 若目标窗口完整性级别高于当前进程，可能触发 `UIPI` 限制。

### 2) 控制台提示剪贴板为空

- 请确认复制的是文本内容。
- 程序读取的是 `CF_UNICODETEXT`，非文本格式无法读取。

### 3) 出现 `SendInput` 失败

- 可能是焦点切换、权限级别或系统策略导致。
- 请检查输出中的 `GetLastError` 编号定位问题。

## 安全与合规

本工具用于本机自动化输入场景。请确保：
- 仅在授权的应用与环境中使用
- 不用于绕过安全策略、未授权控制或违规操作
