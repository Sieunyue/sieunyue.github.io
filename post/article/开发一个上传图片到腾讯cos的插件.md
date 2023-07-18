--- 
title: 开发一个上传图片到腾讯cos的插件
author: Sieunyue
date: 2023-07-13
tags: 
- node
--- 

# 开发一个上传图片到腾讯cos的插件
本文将介绍如何基于Visual Studio Code开发一个简单的Markdown上传图片到腾讯cos插件，该插件会在编辑器的右键菜单中添加一个菜单项，以实现以下功能
* 右键点击图片上传到腾讯云cos并复制url
* 在markdown中右键点击图片上传到腾讯云cos并替换链接地址
  
## [vscode插件能做什么](https://code.visualstudio.com/api/extension-capabilities/overview) {#vscode插件能做什么}
### 通用功能 
   * 添加命令、配置、快捷键和菜单项
   * 存储工作区或全局的数据
   * 消息提示
   * 使用快速选择去收集用户的输入
   * 提供文件选择器给用户选择文件或文件夹
   * 使用`Progress API`去显示操作进度
  
### 主题
  > 控制VS Code的外观，包括编辑器中源代码和VS Code UI的颜色
  * 改变代码颜色
  * 改变UI颜色
  * 添加自定义文件夹图标
  
### 声明语言功能
  > 声明语言功能增加了对编程语言的基本文本编辑支持，例如括号匹配、自动缩进和语法突出显示。这是以声明方式完成的，无需编写任何代码
  * 将常见的 JavaScript 代码片段捆绑到扩展中。
  * 告诉VS Code一种新的编程语言。
  * 添加或替换编程语言的语法。

### 编程语言特性支持
  > 编程语言功能添加了丰富的编程语言支持，例如悬停、转到定义、诊断错误、智能感知和 CodeLens。这些语言功能通过 vscode.languages.* API 公开。扩展可以直接使用这些 API，也可以编写语言服务器并使用 VS Code 语言服务器库将其适应 VS Code。
### 扩展工作台
  * 将自定义上下文菜单操作添加到文件资源管理器
  * 在侧栏中创建新的交互式树视图
  * 定义新的活动栏视图
  * 在状态栏中显示新信息
  * 使用 WebView API 呈现自定义内容
### 调试

## 初始化项目 {#初始化项目}
官方提供了脚手架，我们很方便的就能生成一个基础的项目
```bash
npm install -g yo generator-code

yo code
```
根据自己的需求选择相应的选项

## 项目结构 {#项目结构}
脚手架生成的项目结构如下：
```text
.
├── .vscode
│   ├── launch.json     // Config for launching and debugging the extension
│   └── tasks.json      // Config for build task that compiles TypeScript
├── .gitignore          // Ignore build output and node_modules
├── README.md           // Readable description of your extension's functionality
├── src
│   └── extension.ts    // 插件的主入口
├── package.json        // 配置文件
├── tsconfig.json       // TypeScript configuration
```
我们只需要关注以下文件：
* `package.json` 配置文件，有关插件的配置项都在这个文件里
* `extension.ts` 插件的主入口

### 扩展清单
每个VS Code插件都必须有个`package.json`文件作为配置文件。其中包含了VS Code的特定字段（如：`publisher`、`activationEvents`和`contributes`），详细内容请参考[扩展清单字段说明](https://code.visualstudio.com/api/references/extension-manifest)，我们主要关注以下几个字段
* `name`和`publisher` 插件使用`<publisher>.<name>`作为唯一ID，如果想把插件上架到市场，要，注意插件的ID不能和其他插件冲突
* `main` 指定插件的入口文件，一般不会更改
* `Contribution` [贡献点](https://code.visualstudio.com/api/get-started/extension-anatomy#extension-manifest)？（官方翻译），几乎所有的插件配置都在该字段定义
* `activationEvents` [激活事件](https://code.visualstudio.com/api/references/activation-events)指定插件什么时候激活
* `engines.vscode` 指定插件的最小VS Code版本

本插件示例配置如下：
```json
{
  "activationEvents": [
    "onLanguage:markdown" // 只在markdown文件激活插件
  ],
  "main": "./dist/extension.js",
  "contributes": {
    // 定义命令，按快捷键ctrl+shift+p输入tencent
    "commands": [
      {
        "command": "tencent-cos-uploader.upload",
        "title": "上传图片到tencent cos"
      }
    ],
    
    "menu":{
      // 编辑上下文菜单，command字段要和commands中的command相同
      "editor/context": [
        {
          "when": "editorTextFocus && resourceLangId == markdown",
          "command": "tencent-cos-uploader.upload",
          "group": "tencent-cos-uploader"
        }
      ],
      // 资源管理器上下文菜单
      "explorer/context": [
        {
          "when": "resourceExtname =~ /png|svg|jp(e?)g/",
          "command": "tencent-cos-uploader.upload",
          "group": "tencent-cos-uploader"
        }
      ]
    },

    "configuration": {
      "title": "Tencent Cos Uploader Configuration",
      "properties": {
        "tencent-cos-uploader.secretId": {
          "type": "string",
          "default": "",
          "description": "secretId"
        },
        "tencent-cos-uploader.secretKey": {
          "type": "string",
          "default": "",
          "description": "secretKey"
        },
        "tencent-cos-uploader.bucket": {
          "type": "string",
          "default": "",
          "description": "存储桶名称"
        },
        "tencent-cos-uploader.region": {
          "type": "string",
          "default": "",
          "description": "Bucket所在区域"
        },
        "tencent-cos-uploader.remotePath": {
          "type": "string",
          "default": "",
          "description": "存储目录, 如 a/b, 存储根路径则无需填写，无需以 / 开头"
        }
      }
    }
  }
}
```

### 入口文件
入口文件导出了两个函数`activate`和`deactivate`，`activate`在注册的激活事件发生时执行。 deactivate使你有机会在扩展停用之前执行，常用于清理扩展运行时的数据。对于许多扩展，可能不需要显式清理，并且可以删除 deactivate 方法。但是，如果扩展需要在 VS Code 关闭或禁用或卸载扩展时执行操作，则可以使用此方法执行此操作。



## 创建命令 {#创建命令}
我们在`package.json`中添加了`tencent-cos-uploader.upload`命令，接下来在`extension.ts`添加以下代码

`extension.ts`

```typescript
import path = require('path');
import * as vscode from 'vscode';
import { uploadToCos } from './utils';

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('tencent-cos-uploader.upload', (uri) => {
    if (path.extname(uri.path) === '.md') {
      uploadFromEditor();
    } else {
      uploadFromExplorer(uri);
    }

  });

  context.subscriptions.push(disposable);
}

function uploadFromEditor() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  let position = editor.selection.active;

  // 获取当前行的文本
  let line = editor.document.lineAt(position.line).text;

  // 匹配 Markdown 图片标记 ![...](...)
  let regex = /!\[.*?\]\((.*?)\)/g;

  const match = regex.exec(line);

  if (match === null) {
    return;
  }

  let imagePath = match[1];

  // 将相对路径转换为绝对路径
  let absolutePath = path.join(path.dirname(editor.document.uri.fsPath), imagePath);

  // 在控制台输出当前图片文件的绝对路径

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: '正在上传图片',
    cancellable: false
  }, async (progress) => {
    progress.report({ increment: 0 });

    try {
      const res = await uploadToCos(absolutePath);

      let newLine = line.replace(imagePath, 'https://' + res.Location);

      // 构造替换范围
      let start = new vscode.Position(position.line, match.index); // 起始位置，加 2 是因为 ![ 的长度为 2
      let end = new vscode.Position(position.line, match.index + match[0].length); // 结束位置，减 1 是因为 ) 不需要替换
      let range = new vscode.Range(start, end);

      // 执行替换操作
      editor?.edit(editBuilder => {
        editBuilder.replace(range, newLine);

        vscode.window.showInformationMessage('上传图片完成');
      });
    } catch (e: any) {
      vscode.window.showErrorMessage('上传图片出错！');
    } finally {
      progress.report({ increment: 100 });
    }



    progress.report({ increment: 100 });
  });
}

function uploadFromExplorer(uri: any) {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: '正在上传图片',
    cancellable: false
  }, async (progress) => {
    progress.report({ increment: 0 });

    try {
      const res = await uploadToCos(uri.path);
      vscode.env.clipboard.writeText('https://' + res.Location).then(() => {
        vscode.window.showInformationMessage('图片路径已复制到粘贴板');
      }, (error) => {
        vscode.window.showErrorMessage('复制到粘贴板错误！：' + error);
      });
    } catch (e: any) {
      vscode.window.showErrorMessage('上传图片出错！');
    } finally {
      progress.report({ increment: 100 });
    }

  });
}
```

`utils.ts`
```typescript
import * as vscode from 'vscode';
import * as fs from 'fs';
import COS from 'cos-nodejs-sdk-v5';
import * as crypto from 'crypto';
import * as path from 'path';
import dayjs = require('dayjs');

const COS_SDK = require('cos-nodejs-sdk-v5');

let cos: COS | null = null;

const getCos = () => {
  if (!cos) {
    const config = vscode.workspace.getConfiguration('tencent-cos-uploader');

    cos = new COS_SDK({
      SecretId: config.secretId,
      SecretKey: config.secretKey,
    });

  }

  return cos as COS;
};

const getMD5 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    var rs = fs.createReadStream(filePath);
    var hash = crypto.createHash('md5');
    rs.on('data', hash.update.bind(hash));
    rs.on('end', function () {
      resolve(hash.digest('hex'));
    });
    rs.on('error', function (err) {
      reject(err);
    });
  });
};



export const uploadToCos = async (filePath: string): Promise<COS.PutObjectResult> => {
  const { bucket, region, remotePath } = vscode.workspace.getConfiguration('tencent-cos-uploader');

  if (!bucket) {
    vscode.window.showErrorMessage('missing bucket param');
    return Promise.reject();
  }

  if (!region) {
    vscode.window.showErrorMessage('missing region param');
    return Promise.reject();
  }

  if (!remotePath) {
    vscode.window.showErrorMessage('missing remotePath param');
    return Promise.reject();
  }

  const img = await fs.readFileSync(filePath);

  const cos = getCos();

  const pathKey = (await getMD5(filePath)) + '_' + dayjs().valueOf() + path.extname(filePath);

  return new Promise((resolve, rejects) => {
    cos.putObject({
      Body: img,
      Bucket: bucket,
      Region: region,
      Key: path.join(remotePath, pathKey),
    }, (err: any, data: COS.PutObjectResult) => {
      if (err) {
        console.log(err);
        rejects(err);
        return;
      }

      resolve(data);
    });
  });
};
```

## 效果
![Alt text](https://food-1256333492.cos.ap-guangzhou.myqcloud.com/assets/d4060677feee408e13557a3134e03e0b_1689237468414.gif)

## 打包 {#打包}
安装vsce打包工具
```bash
npm install vsce
```

执行打包命令
```bash
npx vsce package
```

打包完成后会在根目录生产.vsix文件，点击右键选择"安装扩展VSIX"即可使用



## 参考文献
- [官方文档](https://code.visualstudio.com/api)
- [开发一款超级实用的VS Code插件](https://juejin.cn/post/7124197869111738381?searchId=202307131447192D4203812213F77872DD)
- [从0到1开发一款自己的vscode插件](https://juejin.cn/post/7010765441144455199?searchId=202307131447192D4203812213F77872DD)