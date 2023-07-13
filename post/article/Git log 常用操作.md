--- 
title: Git log 常用操作
author: Sieunyue
date: 2022-03-05
tags: 
- git
--- 

# Git log 常用操作
## 常用命令
- 获取某个commit的作者:
```bash
$ git log --pretty=format:“%an” HEAD -1

//sieunyue
```

- 获取某个commit的时间：
```bash
git log --pretty=format:“%cd” HEAD -1

//Wed Apr 3 10:12:33 2019 +0800
```

- 获取某个commit的提交message：
```bash
git log --pretty=format:“%s” HEAD -1

//Change the length of the pre label string
```

