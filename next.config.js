const PostMetaPlugin = require('./lib/meta')
const SvgSpritePlugin = require('./lib/svg-sprite')

/** @type {import('next').NextConfig} */
const nextConfig = ()=>{

  return {
    output: process.env.NODE_ENV === 'development'? undefined : 'export',
    images:{
      unoptimized: true
    },
    webpack(config) {
      config.plugins.push(new PostMetaPlugin())
      config.plugins.push(new SvgSpritePlugin())
      
      return config
    }
  }
}

module.exports = nextConfig
