--- 
title: 实现一个Webpack插件
author: Sieunyue
date: 2023-07-11
description: 在Webpack中，Loader和Plugin是两个核心概念，用于在打包时提供对文件的处理和扩展功能。 Plugin监听Webpack的生命周期事件，如初始化、编译、生成资源、输出等，然后在特定的时机执行自定义的逻辑，它们可以访问Webpack的内部数据结构，并进行修改或扩展。
tags: 
- Webpack
- Node
--- 

# 实现一个Webpack插件

在Webpack中，Loader和Plugin是两个核心概念，用于在打包时提供对文件的处理和扩展功能。
Plugin监听Webpack的生命周期事件，如初始化、编译、生成资源、输出等，然后在特定的时机执行自定义的逻辑。它们可以访问Webpack的内部数据结构，并进行修改或扩展。Webpack使用的`Tapable`库提供了一种事件流的机制，它提前定义好不同阶段的hook函数，然后在不同的生命周期触发回调，插件就可以通过订阅hook函数来实现事件的处理。

## Compiler 和 Compilation  {#12}
在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们是扩展 webpack 引擎重要的第一步

### Compiler 
`Compiler` 模块是 webpack 的主要引擎，它通过 CLI 或者 Node API 传递的所有选项创建出一个 compilation 实例。 它扩展（extends）自 Tapable 类，用来注册和调用插件。 大多数面向用户的插件会首先在 `Compiler` 上注册。
[Complier hook](https://www.webpackjs.com/api/compiler-hooks/)

### Compilation 
`Compilation` 是 `Compiler` 根据webpack配置创建出的一个实例。每当有文件变动或者配置变动，都会产生一个新的 `Compilation` 实例。 `Compilation` 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。 它会对应用程序的依赖图中所有模块， 进行字面上的编译(literal compilation)。 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。

`Compilation` 类扩展(extend)自 Tapable，并提供了以下生命周期钩子。 可以按照 `Compiler` 钩子的相同方式来调用 tap。
[Compilation hook](https://www.webpackjs.com/api/compilation-hooks/)



## 如何实现一个 Webpack Plugin

[webpack 插件](https://www.webpackjs.com/contribute/writing-a-plugin/)由以下组成：
* 一个 JavaScript 命名函数或 JavaScript 类。
* 在插件函数的 prototype 上定义一个 apply 方法。
* 指定一个绑定到 webpack 自身的事件钩子。
* 处理 webpack 内部实例的特定数据。
* 功能完成后调用 webpack 提供的回调。
  
由此可知webpack插件应该是一个函数或者类，如果是函数那么在其原型链上应包含一个apply的方法，如果是类则需要添加apply方法，`apply`的名称已经是固定，多一个字或者少一个字都不行。在apply方法中，通过 compiler 注册指定的事件钩子，在回调函数中拿到 compilation 对象，执行特定的操作逻辑。

> 当我们用 tapAsync 方法来绑定插件时，**必须**调用函数的最后一个参数 callback 指定的回调函数。
> 
> 当我们用 tapPromise 方法来绑定插件时，**必须**返回一个 promise ，异步任务完成后 resolve 。


```javascript
class PluginDemo {
  apply(compiler) {
    compiler.hooks.emit.tap('PluginDemo', (compilation) => {
      compilation.chunks.forEach((chunk) => {
        chunk.forEachModule((module) => {
          module.fileDependencies.forEach((filepath) => {
            console.log(filepath);
          });
        });
      })
    }
  }
}
```

## 总结
webpack plugin实际上就是 webpack 依托事件流的机制，在打包的不同时期，暴露出钩子函数，使开发者能拿到不同编译时期的 compilation 实例，来访问或改变实例上的 module，assets，chunks等资源
