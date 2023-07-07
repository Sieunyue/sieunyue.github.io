--- 
title: 去除a标签模式样式
author: Sieunyue
date: 2019-10-19
tags: 
- css
--- 
# 去除a标签所有默认样式
伪类顺序不能变！！！
```css
a,a:link,a:visited,a:hover,a:active{
    text-decoration: none;
    color:inherit;
}
```