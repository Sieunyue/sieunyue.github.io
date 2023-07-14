const PostMetaPlugin = require('./lib/meta')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images:{
    unoptimized: true
  },
  webpack(config, options) {
    config.plugins.push(new PostMetaPlugin())
 
    return config
  }
}

module.exports = nextConfig
