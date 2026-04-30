# ML Icourse163 Downloader

一个用于中国大学 MOOC (icourse163.org) 的批量下载工具，以 Tampermonkey 用户脚本形式实现。

## 功能特性

- **批量下载文档**：自动下载课程中的 PDF 文档等资料
- ~~**可选视频下载**：支持下载课程视频（高清/标清，MP4/FLV 格式）~~
- **悬浮按钮界面**：在课程页面添加便捷的悬浮下载按钮
- **Aria2 集成**：通过 Aria2 RPC 接口进行高效下载管理
- **智能文件组织**：按章节和节次自动组织文件结构
- **用户友好设置**：提供图形化设置界面，易于配置

## 安装要求

### 必需软件

1. **Tampermonkey 浏览器扩展**
   - Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - Edge: [Tampermonkey](https://microsoftedge.microsoft.com/addon/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Aria2 下载器**
   - 下载并安装 Aria2: [Aria2 官网](https://aria2.github.io/)
   - 启动 Aria2 RPC 服务：
     ```bash
     aria2c --enable-rpc --rpc-listen-all=true --rpc-allow-origin-all
     ```
   - 默认 RPC 地址: `http://127.0.0.1:6800/jsonrpc`

## 安装步骤

1. 安装 Tampermonkey 浏览器扩展
2. 启动 Aria2 RPC 服务
3. 在浏览器中打开脚本文件 `ML-Icourse163_Downloader.js`
4. 点击 Tampermonkey 扩展图标，选择 "添加新脚本"
5. 复制脚本内容并保存

## 使用方法

1. 访问中国大学 MOOC 课程页面 (www.icourse163.org/learn/* 或 www.icourse163.org/spoc/learn/*)
2. 页面右下角会出现 "MOOC下载" 悬浮按钮
3. 点击按钮展开菜单：
   - **批量下载**：开始下载已配置的内容
   - **下载设置**：配置下载参数

## 配置说明

### 基本设置

- **Aria2 地址**：Aria2 RPC 服务地址，默认 `http://127.0.0.1:6800/jsonrpc`
- **文件保存位置**：下载文件的根目录路径

### 下载内容

- **文档**：下载 PDF 等文档资料（默认启用）
- **视频**：下载课程视频（需要启用视频下载功能）

### 视频设置（仅在启用视频下载时显示）

- **视频清晰度**：
  - 高清 (HD)
  - 标清 (SD)
- **视频格式**：
  - MP4
  - FLV

## 文件组织结构

下载的文件将按以下结构组织：

```
[保存路径]/[课程名称]/[第XX章_章节名称]/[第XX节_节次名称]/[第XX部分_部分名称].[扩展名]
```

例如：
```
D:/Downloads/icourse163/机器学习/第01章_绪论/第01节_机器学习概述/第01部分_什么是机器学习.pdf
```

## 注意事项

- 首次使用前请先配置 Aria2 地址和保存路径
- 确保 Aria2 服务正在运行
- 脚本仅在课程学习页面有效
- 下载过程中请勿关闭浏览器页面
- 大量下载可能需要较长时间，请耐心等待

## 许可证

本项目仅供学习和研究使用，请遵守相关法律法规和网站使用条款。
