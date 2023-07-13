const fs = require('fs-extra')
const matter = require('gray-matter')
const path = require('path')

class PostMetaPlugin {
  apply(compiler) {
    compiler.hooks.done.tapAsync('PostMetaPlugin',  async (err, cb) => {
      const dirs = path.resolve(__dirname, '../post/article')
      const metaPath = path.resolve(dirs, '../')

      const posts = (await fs.readdir(dirs)).filter(f => /\.md$/.test(f))

      const meta = await Promise.all(posts.map(async p => matter(await fs.readFile(path.join(dirs, p))).data))

      meta.sort((a, b) => b.date.valueOf() - a.date.valueOf())

      await fs.writeFile(path.join(metaPath, 'post.meta.json'), JSON.stringify(meta))
      cb()
    })
  }
}

module.exports = PostMetaPlugin


// webpack 依托事件流的机制，在打包的不同时期，暴露出钩子函数，使开发者能拿到不同编译时期的 compilation 实例，来访问或改变实例上的 module，assets，chunks