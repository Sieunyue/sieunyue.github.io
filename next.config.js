const PostMetaPlugin = require('./lib/meta')
const SvgSpritePlugin = require('./lib/svg-sprite')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images:{
    unoptimized: true
  },
  webpack(config, options) {
    config.plugins.push(new PostMetaPlugin())
    config.plugins.push(new SvgSpritePlugin())
 
    return config
  }
}

module.exports = nextConfig
