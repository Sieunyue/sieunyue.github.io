--- 
title: Webpack中的Tapable
author: Sieunyue
date: 2023-03-14
tags: 
- Webpack
- node
--- 

# 待完成

webpack 的一个核心工具，但也可用于其他地方， 以提供类似的插件接口。 在 webpack 中的许多对象都扩展自 Tapable 类。 它对外暴露了 tap，tapAsync 和 tapPromise 等方法， 插件可以使用这些方法向 webpack 中注入自定义构建的步骤，这些步骤将在构建过程中触发。