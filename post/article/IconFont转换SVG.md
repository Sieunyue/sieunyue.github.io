--- 
title: IconFont转换SVG
author: Sieunyue
date: 2023-04-22
tags: 
- HTML
- node
- puppeteer
--- 
# IconFont转换SVG

SVG(表现矢量图形的XML)和iconfont(矢量文字)都是前端常用的图标文件。如不考虑浏览器兼容性的话，SVG从易用性、可维护性等各方面都比传统的iconfont更有优势。现在大部分开源图标库都是采用iconfont的形式，如果能将iconfont转换成svg，那么可用的svg图标资源将非常丰富了，那么如何将iconfont转换成svg图标呢？

## 步骤
### 解析SVG font文件
一般的iconfont图标库里都会带有svg文件，如果没有，可以通过`ttf`文件转换得到。
得到这个svg文件后，通过观察其内容结构，发现每一个图标都是一个`glyph`元素，元素的id就是图标的名称。元素内部就是一段svg。只要提取出这些`glyph`元素，就能得到一堆独立的svg图标。
> 注意：
> 常用的svg坐标系和glyph元素的坐标系并不一样，glyph和普通的文字一样，左下角是坐标轴原点，而内嵌的SVG则和Canvas一样，左上角是坐标轴原点。所以中间还需要转换坐标

```xml
<!-- 原始的glyph元素 -->
<glyph glyph-name="xxx" unicode="xxx" d="xxxxx">
</glyph>

<!-- 转换后的SVG片段 -->
<svg xmlns="http://www.w3.org/2000/svg">
  <g transform="scale(1, -1)">
    <path d="xxxx" />
  </g>
</svg>
```
经过简单的y轴反转后发现，矢量图标已经偏离中心线，作为svg图标内签到html里会出现问题。为解决这个问题，需要设置svg的viewBox。并通过设置合适的宽高来去除原图标所有的padding，只保留表示矢量图标的片段

### 处理svg
如何设置viewBox的值？

这里采用一个最简单的方法，把svg片段写入一个svg文件，通过浏览器打开该文件，打开调试控制台，调用`getBoundingClientRect()`函数获取svg位置属性，`left`作为viewBox的起点x轴，`top`作为起点y轴，`width`作为终点x轴，`height`作为终点y轴。这样就能把svg图标完整的显示出来。

但是一个iconfont里有成百上千个svg图标，一个个操作太耗时了。既然浏览器能做，那直接拿一个无头浏览器也可以做，然后就可以脚本化、自动化，故本文使用`puppeteer`来自动化转换svg图标
> Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome，利用Puppeteer可以获取页面DOM节点、网络请求和响应、程序化操作页面行为、进行页面的性能监控和优化、获取页面截图和PDF等。

```javascript
const fs = require('fs')
const puppeteer = require('puppeteer-core')
const path = require('path')
const { parse } = require('svg-parser')
const { optimize } = require('svgo')

async function parseSvgElement(node, prefix) {
  if (node.tagName === 'glyph' && (node.properties['glyph-name'] !== '.notdef')) {
    const fileName = prefix + '-' + node.properties['glyph-name']
    const d = node.properties['d']
    const s = `<svg xmlns="http://www.w3.org/2000/svg">
      <g transform="scale(1, -1)">
        <path d="${d}"></path>
      </g>
    </svg>`


    fs.writeFileSync(`./svg/${fileName}.svg`, s)

    const page = await browser.newPage()

    await page.goto(`file:///Users/sieunyue/Code/svg-platform/svg/${fileName}.svg`)

    await page.waitForSelector('svg')

    const svg = await page.evaluate(() => {
      const _svg = document.querySelector('svg')
      const rect = _svg.querySelector('g').getBoundingClientRect()
      const viewBox = `${rect.left}, ${rect.top}, ${rect.width}, ${rect.height}`

      _svg.setAttribute('viewBox', viewBox)

      return _svg.outerHTML
    })

    const res = optimize(svg)

    fs.writeFileSync(`./svg/${fileName}.svg`, res.data)

    page.close()
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      await parseSvgElement(node.children[i], prefix)
    }
  }
}

let browser

async function startBrowser() {
  // 启动chrome浏览器
  browser = await puppeteer.launch({
    executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    headless: true
  })
}

async function main() {
  await startBrowser()

  const dir = fs.readdirSync('./svg-origin')

  for (let i = 0; i < dir.length; i++) {
    if (dir[i] === '.DS_Store') {
      continue
    }
    const svgStr = fs.readFileSync(path.resolve(__dirname, `./svg-origin/${dir[i]}`), { encoding: 'utf-8' }).toString()

    const pared = parse(svgStr)

    await parseSvgElement(pared, dir[i].split('.').shift())
  }

  await browser.close()
}
```

## 总结
最终从iconfont得到SVG的整个流程可以描述如下：由iconfont库得到SVG文件（可能要转换），然后抽取各个glyph片段，翻转坐标系得到SVG片段，用无头浏览器把矢量图形对齐到坐标轴，用svgo优化输出。

