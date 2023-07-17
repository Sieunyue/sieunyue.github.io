const fs = require('fs-extra')
const matter = require('gray-matter')
const path = require('path')
const SVGSprite = require('svg-sprite')

function createTypes (names) {
  let s = `declare type Icon = ${names.map(t => `'icon-${t}'`).join(' | ')}`

  const typesDir = path.resolve(__dirname, '../types/icon.d.ts')

  fs.mkdirSync(path.dirname(typesDir), { recursive: true })

  fs.writeFileSync(typesDir, s)
}

class PostMetaPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('SvgSpritePlugin', async (compilation, cb) => {

      const dirs = path.resolve(__dirname, '../src/assets/svg')

      const publicPath = path.resolve(__dirname, '../public/svg_cdn.js')

      const s = (await fs.readdir(dirs)).filter(t => t.endsWith('.svg'))

      createTypes(s.map(o => o.split('.').shift()))

      const sprite = new SVGSprite({
        mode: {
          symbol: true
        }
      })

      for (let i = 0; i < s.length; i++) {
        sprite.add(`icon-${s[i]}`, null, await fs.readFile(path.join(dirs, s[i])), { encoding: 'utf-8' })
      }

      const { result } = await sprite.compileAsync()

      for (const mode of Object.values(result)) {
        for (const resource of Object.values(mode)) {

          fs.mkdirSync(path.dirname(publicPath), { recursive: true })

          const js = `
            (function a(){
              const container = document.createElement('div')
              container.innerHTML = '${resource.contents.toString()}'
              container.classList.add('svg-sprite-container')
              
              document.body.appendChild(container)
            })()
          `

          fs.writeFileSync(publicPath, js)
        }
      }

      cb()
    })

    compiler.hooks.done.tapAsync('SvgSpritePlugin', async (_err, cb) => {
      const publicPath = path.resolve(__dirname, '../public/svg_cdn.js')
      const outPath = path.resolve(__dirname, '../out/svg_cdn.js')
     
      await fs.copyFile(publicPath, outPath)

      cb()
    })
  }
}

module.exports = PostMetaPlugin


// webpack 依托事件流的机制，在打包的不同时期，暴露出钩子函数，使开发者能拿到不同编译时期的 compilation 实例，来访问或改变实例上的 module，assets，chunks