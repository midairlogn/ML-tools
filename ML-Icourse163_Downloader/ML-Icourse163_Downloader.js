// ==UserScript==
// @name              ML - Icourse163 Downloader
// @namespace         http://tampermonkey.net/
// @version           3.3
// @description       在中国大学 MOOC 的课程学习页面添加批量下载按钮，方便将文档、视频下载到本地学习。默认仅下载文档，可按需勾选下载视频。以悬浮按钮形式呈现。
// @description:en    add download button on icourse163.org to download documents and videos. By default, only documents are downloaded. Presented as a floating button.
// @author            Midairlogn
// @icon              data:image/png;base64,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
// @require           https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @match             *://www.icourse163.org/learn/*
// @match             *://www.icourse163.org/spoc/learn/*
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @connect           www.icourse163.org
// @connect           vod.study.163.com
// @connect           localhost
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var log_count = 1;
    var global_download_videos = false; // 设置是否显示下载视频的选项。设为true，显示下载视频的配置，按配置决定是否下载视频、清晰度与格式；设为false，不显示下载视频的设置，不下载视频。
    var golbal_debug_mode = false; // 设置是否为调试模式。True: 不向Aria2发送下载命令；False: 正常发送。

    // --- 用户可配置项 (通过设置界面修改) ---
    var aria2_url = "http://127.0.0.1:6800/jsonrpc"; // Aria2 RPC 地址
    var course_save_path = ''; // 课程保存路径 (例如: /Users/mofiter/Downloads/icourse163)
    var download_documents_enabled = true; // 是否下载文档 (PDF)
    var download_videos_enabled = false; // 是否下载视频 (默认不下载)
    var video_quality = 2; // 视频清晰度: 2=高清 (HD), 1=标清 (SD) (对应 Python 脚本中的 mode: IS_SHD=3, IS_HD=2, IS_SD=1)
    var video_format = 'mp4'; // 视频格式: 'mp4' 或 'flv'
    // --- 用户可配置项结束 ---

    var course_info = {'course_id': null,'course_name': '','chapter_info': []}; // 课程信息结构
    var csrfToken = ''; // CSRF token for API requests

    // 自定义 log 函数
    function mylog(param1,param2){
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log("#" + log_count++ + "-Icourse163Downloader-log:",param1,param2);
    }

    // 页面加载完成后执行初始化
    $(document).ready(function() {
        getCourseIdAndName();
        // 增加对 course_info.course_id 的有效性检查
        if (!course_info.course_id || isNaN(course_info.course_id)) {
            mylog("致命错误: 无法获取有效的课程ID，脚本将停止获取课程内容。");
            return; // 停止执行，因为无法获取课程内容
        }
        loadSetting(); // 优先加载设置
        createFloatingButton(); // 创建悬浮按钮和菜单
        getCourseContentInfo(); // 获取课程结构和内容信息
        mylog("ML - 中国大学 MOOC 下载助手加载完成~");
    });

    // 获取课程ID和名称
    function getCourseIdAndName(){
        var courseCardDto = unsafeWindow.courseCardDto;
        if (courseCardDto) {
            course_info.course_name = courseCardDto.name.replace(/\/|:|\?|\*|"|<|>|\|/g," ");
            if(location.href.match(/tid=(\d+)/)){
                course_info.course_id = location.href.match(/tid=(\d+)/)[1];
            }else{
                // 如果URL中没有tid，则尝试使用courseCardDto.currentTermId
                course_info.course_id = courseCardDto.currentTermId;
            }
            mylog("通过 courseCardDto 获取课程信息:", course_info.course_name, course_info.course_id);
        } else {
            // 备用方案：从URL和页面标题获取
            if(location.href.match(/learn\/(\d+)/)){
                // 对于 /learn/xxx 这种URL，xxx 通常是课程ID，但API需要termId。
                // 尝试从标题获取课程名，课程ID可能需要后续API确认
                course_info.course_id = location.href.match(/learn\/(\d+)/)[1]; // 暂时用这个，可能不是真正的termId
                course_info.course_name = $('title').text().replace(/ - 中国大学MOOC/g, '').trim().replace(/\/|:|\?|\*|"|<|>|\|/g," ");
                mylog("通过 URL (learn) 和标题获取课程信息 (ID可能不精确):", course_info.course_name, course_info.course_id);
            } else if (location.href.match(/tid=(\d+)/)) {
                 course_info.course_id = location.href.match(/tid=(\d+)/)[1];
                 course_info.course_name = $('title').text().replace(/ - 中国大学MOOC/g, '').trim().replace(/\/|:|\?|\*|"|<|>|\|/g," ");
                 mylog("通过 URL (tid) 和标题获取课程信息:", course_info.course_name, course_info.course_id);
            } else {
                 mylog("警告：无法从 courseCardDto 或 URL 获取课程ID，可能影响课程内容获取。");
            }
        }

        // 获取CSRF Token
        // 优先从 unsafeWindow.NeteaseSecToken 获取，其次从 cookie 获取
        csrfToken = unsafeWindow.NeteaseSecToken || (document.cookie.match(/NTESSTUDYSI=(\w+)/) ? document.cookie.match(/NTESSTUDYSI=(\w+)/)[1] : '');
        if (!csrfToken) {
            mylog("警告: 无法获取CSRF Token, 部分功能可能受限。");
        } else {
            mylog("CSRF Token 获取成功:", csrfToken);
        }
    }

    // 创建悬浮按钮和菜单
    function createFloatingButton(){
        var $floatContainer = $('<div id="mooc-downloader-float-btn"></div>');
        var $toggleButton = $('<div id="mooc-downloader-toggle">MOOC下载</div>');
        var $menu = $('<div id="mooc-downloader-menu" style="display:none;"></div>');
        var $batchDownloadBtn = $('<a class="menu-item" href="#">批量下载</a>');
        var $settingsBtn = $('<a class="menu-item" href="#">下载设置</a>');

        $menu.append($batchDownloadBtn).append($settingsBtn);
        $floatContainer.append($toggleButton).append($menu);
        $('body').append($floatContainer);

        // 悬浮按钮样式
        $floatContainer.css({
            'position': 'fixed',
            'bottom': '20px',
            'right': '20px',
            'z-index': '99999',
            'font-family': 'sans-serif, Arial',
            'font-size': '14px',
            'box-shadow': '0 2px 10px rgba(0,0,0,0.2)',
            'border-radius': '8px',
            'overflow': 'hidden' // 隐藏溢出内容，确保圆角
        });

        $toggleButton.css({
            'background-color': '#4CAF50',
            'color': 'white',
            'padding': '10px 15px',
            'cursor': 'pointer',
            'text-align': 'center',
            'border-radius': '8px',
            'box-shadow': '0 2px 5px rgba(0,0,0,0.2)'
        });

        $menu.css({
            'background-color': '#f8f8f8',
            'border': '1px solid #ccc',
            'border-top': 'none',
            'border-radius': '0 0 8px 8px',
            'padding': '5px 0'
        });

        $('.menu-item').css({
            'display': 'block',
            'padding': '8px 15px',
            'color': '#333',
            'text-decoration': 'none',
            'cursor': 'pointer'
        }).hover(function() {
            $(this).css('background-color', '#e0e0e0');
        }, function() {
            $(this).css('background-color', 'transparent');
        });

        // 事件绑定
        $toggleButton.click(function(){
            $menu.slideToggle(200); // 平滑显示/隐藏菜单
        });

        $batchDownloadBtn.click(function(e){
            e.preventDefault(); // 阻止a标签默认跳转
            $menu.slideUp(200); // 隐藏菜单
            loadSetting(); // 确保使用最新设置
            if(course_save_path === ""){
                alert("请点击下载设置去填写文件保存位置！");
            }else if(aria2_url === ""){
                alert("请点击下载设置去填写 Aria2 地址！");
            }else{
                batchDownload();
            }
        });

        $settingsBtn.click(function(e){
            e.preventDefault(); // 阻止a标签默认跳转
            $menu.slideUp(200); // 隐藏菜单
            showSetting();
        });

        // 点击外部关闭菜单
        $(document).on('click', function(event) {
            if (!$floatContainer.is(event.target) && $floatContainer.has(event.target).length === 0) {
                if ($menu.is(':visible')) {
                    $menu.slideUp(200);
                }
            }
        });
    }

    // 加载个人设置
    function loadSetting(){
        aria2_url = GM_getValue('aria2_url','http://127.0.0.1:6800/jsonrpc');
        course_save_path = GM_getValue('course_save_path','');
        download_documents_enabled = GM_getValue('download_documents_enabled', true); // 默认下载文档
        download_videos_enabled = GM_getValue('download_videos_enabled', false); // 默认不下载视频
        video_quality = GM_getValue('video_quality', 2); // 默认高清
        video_format = GM_getValue('video_format', 'mp4'); // 默认mp4
    }

    // 打开设置界面
    function showSetting(){
        var $settingPanel = $('#dl-setting');
        if($settingPanel.length === 0){
            var container = document.createElement("div");
            container.id = "dl-setting";
            container.style = "position:fixed;z-index:999999;top:50%;left:50%;transform:translate(-50%, -50%);width:280px;height:auto;background-color:#f8f8f8;padding:15px 20px;font-size:14px;border:1px solid #ccc;box-shadow: 0 0 20px rgba(0,0,0,0.3);border-radius:8px;";
            container.innerHTML =
            "<div style='line-height:32px;'>" +
            "<legend style='text-align:center;font-size:20px;font-weight:bold;margin-bottom:15px;color:#333;'>下载设置</legend>" +
            "<ul style='list-style:none;padding:0;margin:0;'>\n" +
            "<li style='margin-bottom:5px;'>Aria2 地址：</li>\n" +
            "<li style='margin-bottom:10px;'><input type='text' id='aria2_url_input' name='aria2_url' value='" + aria2_url + "' style='width:calc(100% - 12px);padding:6px;border:1px solid #ccc;background:#ffffff;border-radius:4px;'></input></li>\n" +
            "<li style='margin-bottom:5px;'>文件保存位置：</li>\n" +
            "<li style='margin-bottom:15px;'><input type='text' id='save_path_input' name='save_path' value='" + course_save_path + "' style='width:calc(100% - 12px);padding:6px;border:1px solid #ccc;background:#ffffff;border-radius:4px;'></input></li>\n" +
            "<li style='margin-bottom:10px;font-weight:bold;'>下载内容：</li>\n" +
            "<li style='margin-bottom:15px;'>\n" +
            "<label title='下载课程文档（PDF等）' style='margin-right:20px;'><input id='download-docs' name='download-content' value='docs' type='checkbox' style='margin:0 5px;vertical-align:middle;'" + (download_documents_enabled ? "checked":"") + "></input>文档</label>\n"
            +
            // 视频相关设置仅在 global_download_videos 为 true 时显示
            (global_download_videos ?
                "<label title='下载课程视频'><input id='download-videos' name='download-content' value='videos' type='checkbox' style='margin:0 5px;vertical-align:middle;'" + (download_videos_enabled ? "checked":"") + "></input>视频</label>\n"
                : ""
            ) +
            "</li>\n"
            +
            // 视频清晰度和格式设置仅在 global_download_videos 为 true 时显示
            (global_download_videos ?
                "<li style='margin-bottom:10px;font-weight:bold;'>视频清晰度：</li>\n" +
                "<li style='margin-bottom:15px;'><label title='高清' style='margin-right:15px;'><input id='video-quality-2' name='video-quality' value='2' type='radio' style='margin:0 5px;vertical-align:middle;'" + (video_quality==2 ? "checked":"") + "></input>高清</label>\n" +
                "<label title='标清'><input id='video-quality-1' name='video-quality' value='1' type='radio' style='margin:0 5px;vertical-align:middle;'" + (video_quality==1 ? "checked":"") + "></input>标清</label></li>\n" +
                "<li style='margin-bottom:10px;font-weight:bold;'>视频格式：</li>\n" +
                "<li style='margin-bottom:20px;'><label title='mp4' style='margin-right:15px;'><input id='video-format-mp4' name='video-format' value='mp4' type='radio' style='margin:0 5px;vertical-align:middle;'" + (video_format=='mp4' ? "checked":"") + "></input>mp4</label>" +
                "<label title='flv'><input id='video-format-flv' name='video-format' value='flv' type='radio' style='margin:0 5px;vertical-align:middle;'" + (video_format=='flv' ? "checked":"") + "></input>flv</label></li>\n"
                : ""
            ) +
            "</ul>\n" +
            "<div style='overflow:hidden;text-align:center;'>\n" +
            "<input type='button' value='取消' id='cancel_button' style='border:1px solid #ccc;padding:8px 15px;background:#ffffff;cursor:pointer;border-radius:4px;margin-right:10px;'></input>\n" +
            "<input type='button' value='保存' id='save_button' style='border:1px solid #4CAF50;padding:8px 15px;background:#4CAF50;color:white;cursor:pointer;border-radius:4px;'></input>\n" +
            "</div>\n" +
            "</div>";
            document.body.appendChild(container);

            $settingPanel = $('#dl-setting'); // 重新获取jQuery对象

            $('#save_button').click(function(){
                GM_setValue('aria2_url',$('#aria2_url_input').val());
                GM_setValue('course_save_path',$('#save_path_input').val());
                GM_setValue('download_documents_enabled',$('#download-docs').prop('checked'));
                // 仅在 global_download_videos 为 true 时保存视频相关设置
                if(global_download_videos){
                    GM_setValue('download_videos_enabled',$('#download-videos').prop('checked'));
                    GM_setValue('video_quality',parseInt($('input[name="video-quality"]:checked').val()));
                    GM_setValue('video_format',$('input[name="video-format"]:checked').val());
                }
                loadSetting(); // 重新加载设置到变量
                $settingPanel.hide();
                alert('设置已保存！');
            });
            $('#cancel_button').click(function(){
                $settingPanel.hide();
            });
        }else{
            loadSetting(); // 确保加载最新设置到UI
            $('#aria2_url_input').val(aria2_url);
            $('#save_path_input').val(course_save_path);
            $('#download-docs').prop('checked', download_documents_enabled);
            // 仅在 global_download_videos 为 true 时更新视频相关UI
            if(global_download_videos){
                $('#download-videos').prop('checked', download_videos_enabled);
                $('input[name="video-quality"][value="' + video_quality + '"]').prop('checked', true);
                $('input[name="video-format"][value="' + video_format + '"]').prop('checked', true);
            }
            $settingPanel.show();
        }
    }

    // 获取课程信息 (新API: getLastLearnedMocTermDto.rpc)
    function getCourseContentInfo(){
        if (!course_info.course_id) {
            mylog("课程ID未获取到, 无法获取课程内容。");
            return;
        }
        if (!csrfToken) {
            mylog("CSRF Token 未获取到, 无法请求课程内容API。");
            return;
        }

        mylog(`正在请求课程内容API: termId=${course_info.course_id}, csrfKey=${csrfToken}`);

        GM_xmlhttpRequest({
            url: `https://www.icourse163.org/web/j/courseBean.getLastLearnedMocTermDto.rpc?csrfKey=${csrfToken}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'edu-script-token': csrfToken
            },
            data: `termId=${course_info.course_id}`,
            responseType: 'json',
            onload: function(response) {
                mylog("课程内容API原始响应对象:", response); // 打印完整的响应对象
                if (response.status === 200) {
                    if (response.response) {
                        const data = response.response; // responseType: 'json' 意味着这已经是一个解析后的对象
                        mylog("课程内容API解析后数据:", data); // 打印解析后的数据

                        if (data.code === 0) {
                            if (data.result && data.result.mocTermDto && data.result.mocTermDto.chapters) {
                                const chapters = data.result.mocTermDto.chapters; // 获取 chapters 数组
                                course_info.chapter_info = []; // 清空旧数据
                                (chapters || []).forEach(chapterVo => { // 确保即使 chapters 为空数组也能安全遍历
                                    let chapter = {
                                        chapter_id: chapterVo.id,
                                        chapter_name: chapterVo.name.replace(/\/|:|\?|\*|"|<|>|\|/g," "),
                                        lesson_info: []
                                    };
                                    // 增加对 lessons 的健壮性检查
                                    (chapterVo.lessons || []).forEach(lessonVo => { // lessons
                                        let lesson = {
                                            lesson_id: lessonVo.id,
                                            lesson_name: lessonVo.name.replace(/\/|:|\?|\*|"|<|>|\|/g," "),
                                            section_info: []
                                        };
                                        // 增加对 units 的健壮性检查
                                        (lessonVo.units || []).forEach(sectionVo => { // units
                                            let section = {
                                                chapter_id: sectionVo.chapterId,
                                                lesson_id: sectionVo.lessonId,
                                                content_id: sectionVo.contentId, // 这个 contentId 将作为 DWR c0-param0
                                                section_id: sectionVo.id, // 这个 id 将作为 DWR c0-param3
                                                section_name: sectionVo.name.replace(/\/|:|\?|\*|"|<|>|\|/g," "),
                                                content_type: sectionVo.contentType // 1:视频, 3:文档
                                            };
                                            lesson.section_info.push(section);
                                        });
                                        chapter.lesson_info.push(lesson);
                                    });
                                    course_info.chapter_info.push(chapter);
                                });
                                mylog("课程内容信息获取成功:", course_info);
                            } else {
                                // 更精确的错误消息
                                mylog("获取课程内容信息失败：响应中缺少 'result.mocTermDto.chapters' 字段。", data);
                            }
                        } else {
                            // API返回错误码，打印具体错误码和消息
                            mylog("获取课程内容信息失败: API返回错误码 " + data.code + "。", data.message || "无详细错误信息", data);
                        }
                    } else {
                        mylog("获取课程内容信息失败：响应数据为空。", response);
                    }
                } else {
                    // HTTP状态码不是200，打印状态码和状态文本
                    mylog("请求课程内容API失败: HTTP状态码 " + response.status + "。", response.statusText, response);
                }
            },
            onerror: function(error) {
                mylog("请求课程内容API发生网络错误:", error);
            }
        });
    }

    /**
     * 新增函数：通过 DWR 接口获取PDF的真实下载链接并发送到Aria2
     * 对应 Python 脚本中的 _get_source_text 和 _get_pdf_url 方法
     */
    async function fetchPdfUrlAndDownloadDWR(section, save_dir, file_base_name) {
        // DWR 接口所需的参数
        const contentId = section.content_id; // 对应 Python 脚本中的 params[0]
        const contentType = 3; // PDF 类型，对应 Python 脚本中的 params[1]
        const sectionId = section.section_id; // 对应 Python 脚本中的 params[2] (即 id)

        if (!contentId || !sectionId) {
            mylog(`跳过文档下载 ${file_base_name}: 缺少 contentId 或 sectionId。`);
            return Promise.resolve();
        }

        const parse_url = 'https://www.icourse163.org/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr';
        // Python 脚本中使用的 scriptSessionId 和 batchId
        const scriptSessionIdPlaceholder = '${scriptSessionId}190';
        const batchId = '1543633161622';

        // 构建 DWR POST 请求体，模仿 Python 脚本的 parse_data
        const post_data = `callCount=1&scriptSessionId=${scriptSessionIdPlaceholder}&c0-scriptName=CourseBean&c0-methodName=getLessonUnitLearnVo&httpSessionId=${csrfToken}&c0-id=0&c0-param0=number:${contentId}&c0-param1=number:${contentType}&c0-param2=number:0&c0-param3=number:${sectionId}&batchId=${batchId}`;

        return new Promise((resolve, reject) => {
            mylog(`正在通过 DWR 获取文档 ${file_base_name} 的真实PDF链接 (contentId: ${contentId}, sectionId: ${sectionId})...`);

            GM_xmlhttpRequest({
                url: parse_url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', // DWR 请求的关键 Content-Type
                    'Accept': '*/*', // 常见浏览器请求头
                    'X-Requested-With': 'XMLHttpRequest', // 常见 DWR 请求头
                    'Referer': 'https://www.icourse163.org/', // 避免部分服务器验证 Referer
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36' // 模拟浏览器 User-Agent
                },
                data: post_data,
                responseType: 'text', // DWR 响应是纯文本，需要手动解析
                onload: function(response) {
                    // console.log("DWR 响应纯文本: ", response);
                    if (response.status === 200) {
                        const text = response.responseText;
                        // 使用正则表达式从 DWR 响应中提取 textOrigUrl
                        const pdfMatch = text.match(/textOrigUrl:"(.*?)"/);
                        if (pdfMatch && pdfMatch[1]) {
                            const pdfDownloadUrl = pdfMatch[1];
                            let final_file_name = file_base_name + '.pdf';
                            sendDownloadTaskToAria2(pdfDownloadUrl, final_file_name, save_dir);
                            mylog(`文档 ${file_base_name} 的真实PDF链接已获取并发送下载任务: ${pdfDownloadUrl}`);
                            resolve();
                        } else {
                            mylog(`文档 ${file_base_name} 的真实PDF链接未在 DWR 响应中找到。响应数据:`, text);
                            reject(`PDF链接未找到: ${file_base_name}`);
                        }
                    } else {
                        mylog(`获取文档 ${file_base_name} DWR 请求失败。HTTP状态: ${response.status}, 响应:`, response.responseText);
                        reject(`获取PDF DWR 数据失败: ${file_base_name}`);
                    }
                },
                onerror: function(error) {
                    mylog(`网络错误：获取文档 ${file_base_name} DWR 请求失败:`, error);
                    reject(`网络错误获取PDF DWR 数据: ${file_base_name}`);
                }
            });
        });
    }

    /**
     * 新增函数：通过 DWR 接口获取视频的真实下载链接并发送到Aria2
     * 对应 Python 脚本中的 _get_source_text 和 _get_video_url 方法
     */
    async function fetchVideoUrlAndDownloadDWR(section, save_dir, file_base_name) {
        const contentId = section.content_id;
        const contentType = 1; // 视频类型
        const sectionId = section.section_id;

        if (!contentId || !sectionId) {
            mylog(`跳过视频下载 ${file_base_name}: 缺少 contentId 或 sectionId。`);
            return Promise.resolve();
        }

        const parse_url = 'https://www.icourse163.org/dwr/call/plaincall/CourseBean.getLessonUnitLearnVo.dwr';
        const scriptSessionIdPlaceholder = '${scriptSessionId}190';
        const batchId = '1543633161622';

        const post_data = `callCount=1&scriptSessionId=${scriptSessionIdPlaceholder}&c0-scriptName=CourseBean&c0-methodName=getLessonUnitLearnVo&httpSessionId=${csrfToken}&c0-id=0&c0-param0=number:${contentId}&c0-param1=number:${contentType}&c0-param2=number:0&c0-param3=number:${sectionId}&batchId=${batchId}`;

        return new Promise((resolve, reject) => {
            mylog(`正在通过 DWR 获取视频 ${file_base_name} 的真实视频链接 (contentId: ${contentId}, sectionId: ${sectionId})...`);

            GM_xmlhttpRequest({
                url: parse_url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Accept': '*/*',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': 'https://www.icourse163.org/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
                },
                data: post_data,
                responseType: 'text',
                onload: function(response) {
                    // console.log("DWR 响应纯文本: ", response);
                    if (response.status === 200) {
                        const text = response.responseText;
                        let videoUrl = null;
                        let final_ext = video_format; // 默认使用用户选择的格式

                        // 优先顺序: Shd (超清), Hd (高清), Sd (标清)
                        const resolutions = ['Shd', 'Hd', 'Sd'];
                        // Python 脚本中 mode: IS_SHD=3, IS_HD=2, IS_SD=1
                        // JS 脚本中 video_quality: 2=高清, 1=标清
                        // 映射关系：
                        // video_quality=2 (高清) -> 优先 Hd，其次 Sd (如果Hd没有)
                        // video_quality=1 (标清) -> 优先 Sd

                        let selectedQualityIndex = 0; // 默认Shd (最高画质)
                        if (video_quality === 2) { // 用户选择高清
                            selectedQualityIndex = 1; // 从Hd开始找
                        } else if (video_quality === 1) { // 用户选择标清
                            selectedQualityIndex = 2; // 从Sd开始找
                        }

                        for (let i = selectedQualityIndex; i < resolutions.length; i++) {
                            const res = resolutions[i];
                            // 尝试匹配用户选择的格式
                            const videoMatch = text.match(new RegExp(`(?<ext>${video_format})${res}Url="(?<url>.*?\\.${video_format}.*?)"`));
                            if (videoMatch && videoMatch.groups && videoMatch.groups.url) {
                                videoUrl = videoMatch.groups.url;
                                final_ext = video_format; // 确认扩展名
                                break;
                            }
                            // 如果用户选择的格式没有，尝试匹配另一个格式
                            const otherFormat = (video_format === 'mp4' ? 'flv' : 'mp4');
                            const otherVideoMatch = text.match(new RegExp(`(?<ext>${otherFormat})${res}Url="(?<url>.*?\\.${otherFormat}.*?)"`));
                            if (otherVideoMatch && otherVideoMatch.groups && otherVideoMatch.groups.url) {
                                videoUrl = otherVideoMatch.groups.url;
                                final_ext = otherFormat; // 确认扩展名
                                break;
                            }
                        }

                        if (videoUrl) {
                            let final_file_name = file_base_name + '.' + final_ext;
                            sendDownloadTaskToAria2(videoUrl, final_file_name, save_dir);
                            mylog(`视频 ${file_base_name} 的真实视频链接已获取并发送下载任务: ${videoUrl}`);
                            resolve();
                        } else {
                            mylog(`视频 ${file_base_name} 的真实视频链接未在 DWR 响应中找到符合清晰度和格式的。响应数据:`, text);
                            reject(`视频链接未找到: ${file_base_name}`);
                        }
                    } else {
                        mylog(`获取视频 ${file_base_name} DWR 请求失败。HTTP状态: ${response.status}, 响应:`, response.responseText);
                        reject(`获取视频 DWR 数据失败: ${file_base_name}`);
                    }
                },
                onerror: function(error) {
                    mylog(`网络错误：获取视频 ${file_base_name} DWR 请求失败:`, error);
                    reject(`网络错误获取视频 DWR 数据: ${file_base_name}`);
                }
            });
        });
    }


    // 批量下载
    async function batchDownload(){ // 将函数声明为 async
        if (course_info.chapter_info.length === 0) {
            alert("课程内容信息尚未加载完成，请稍后再试或刷新页面。");
            return;
        }

        mylog("开始批量下载...");
        let tasks_count = 0;
        const downloadPromises = []; // 用于收集所有异步下载任务的Promise

        for (const chapter of course_info.chapter_info) {
            const chapterIndex = course_info.chapter_info.indexOf(chapter);
            for (const lesson of chapter.lesson_info) {
                const lessonIndex = chapter.lesson_info.indexOf(lesson);
                for (const section of lesson.section_info) {
                    const sectionIndex = lesson.section_info.indexOf(section);

                    // 构建文件保存路径
                    let save_dir = course_save_path.replace(/\\/g,'\/') + '/' +
                                   course_info.course_name + '/' +
                                   `第${(chapterIndex + 1).toString().padStart(2, '0')}章_${chapter.chapter_name}` + '/' +
                                   `第${(lessonIndex + 1).toString().padStart(2, '0')}节_${lesson.lesson_name}`;

                    // 构建文件名前缀，包含章节/小节编号和名称，避免重名
                    let file_base_name = `第${(sectionIndex + 1).toString().padStart(2, '0')}部分_${section.section_name}`;

                    if(download_documents_enabled && section.content_type == '3'){ // 文档
                        downloadPromises.push(
                            fetchPdfUrlAndDownloadDWR(section, save_dir, file_base_name)
                                .then(() => { tasks_count++; })
                                .catch(err => { mylog(err); })
                        );
                    } else if (
                        // 仅在 global_download_videos 为 true 时处理视频下载
                        global_download_videos &&
                        download_videos_enabled &&
                        section.content_type == '1'
                    ) {
                        downloadPromises.push(
                            fetchVideoUrlAndDownloadDWR(section, save_dir, file_base_name)
                                .then(() => { tasks_count++; })
                                .catch(err => { mylog(err); })
                        );
                    }
                    // 其他内容类型（如作业、讨论）不处理
                }
            }
        }

        // 等待所有下载任务的Promise完成
        await Promise.all(downloadPromises);

        if(!golbal_debug_mode){
            if (tasks_count > 0) {
                alert(`已向Aria2发送 ${tasks_count} 个下载任务, 请检查Aria2下载器。`);
            } else {
                alert("没有找到符合下载选项的内容，请检查下载设置。");
            }
        }
    }

    // 将下载链接发送到 Aria2 下载
    function sendDownloadTaskToAria2(download_url, file_name, save_path){
        var json_rpc = {
            id: new Date().getTime(), // 唯一的请求ID
            jsonrpc:'2.0',
            method:'aria2.addUri',
            params:[
                [download_url],
                {
                    dir: save_path,
                    out: file_name,
                    // 添加Referer和User-Agent，防止部分资源下载失败
                    header: [
                        'Referer: https://www.icourse163.org/',
                        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
                    ]
                }
            ]
        };
        if(!golbal_debug_mode){
            GM_xmlhttpRequest({
                url: aria2_url,
                method: 'POST',
                data: JSON.stringify(json_rpc),
                headers: {
                    'Content-Type': 'application/json'
                },
                onerror: function(response){
                    mylog("Aria2 RPC 请求错误:", response);
                    alert("Aria2 RPC 请求失败! 请检查Aria2是否已启动, 以及设置中的Aria2地址是否正确。\n错误信息:" + response.statusText || response.responseText);
                },
                onload: function(response){
                    mylog("Aria2 RPC 响应:", response);
                    if (response.status === 200 && response.response) {
                        const res = JSON.parse(response.response);
                        if (res.error) {
                            mylog(`Aria2 添加任务失败: ${res.error.message}`);
                            alert(`Aria2 添加任务失败: ${res.error.message}\n请检查Aria2配置和文件保存路径。`);
                        } else {
                            mylog(`Aria2 任务添加成功: ${file_name}`);
                        }
                    } else {
                        mylog("Aria2 RPC 响应异常:", response.status, response.statusText);
                        alert("Aria2 RPC 响应异常, 可能Aria2服务未正确运行或地址有误。");
                    }
                }
            });
        };
    }

})();
