--- 
title: Commit Message 规范格式
author: Sieunyue
date: 2022-03-05
tags: 
- git
--- 

# Commit Message 规范格式
```xml
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```
## Header
### type（必填）
```bash
# 主要 type
feat:     增加新功能
fix:      修复 bug

# 特殊type
docs:     只改动了文档相关的内容
style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
build:    构造工具的或者外部依赖的改动，例如 webpack，npm
refactor: 代码重构时使用
revert:   执行 git revert 打印的 message

# 暂不使用type
test:     添加测试或者修改现有测试
perf:     提高性能的改动
ci:       与 CI（持续集成服务）有关的改动
chore:    不修改 src 或者 test 的其余修改，例如构建过程或辅助工具的变动
```
### scope（非必填）
**scope** 用于说明 **commit** 影响的范围，比如数据层、控制层、视图层等等，视实际使用情况而定
### subject（必填）
**subject** 用于说明 **commit** 目的的简短描述，不超过50个字符
## Body
body 用于说明 commit 的详细描述，内容可以分成多行，主要描述改动之前的情况及修改动机，对于小的修改不作要求，但是重大需求、更新等尽量添加 body 来作说明
### Footer
#### break changes
break changes 用于说明是否产生了破坏性修改(不兼容变动)，涉及 break changes 的改动必须指明该项，类似版本升级、接口参数减少、接口删除、迁移等。
#### affect issues
affect issues 用于说明是否影响了某个 issue。
> 注： 下面的 commitizen + cz-conventional-changelog 可以在提交的时候使用 git cz 命令会自动显示对应的 commit 规范信息提示



