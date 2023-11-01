--- 
title: PostgreSQL：JSON操作
author: Sieunyue
date: 2022-03-14
description: PostgreSql支持两种json数据类型：json和jsonb
tags: 
- Postgresql
- Sql
--- 

## 正文
> postgresql支持两种json数据类型：json和jsonb，而两者唯一的区别在于效率,json是对输入的完整拷贝，使用时再去解析，所以它会保留输入的空格，重复键以及顺序等。而jsonb是解析输入后保存的二进制，它在解析时会删除不必要的空格和重复的键，顺序和输入可能也不相同。使用时不用再次解析。两者对重复键的处理都是保留最后一个键值对。效率的差别：json类型存储快，使用慢，jsonb类型存储稍慢，使用较快。

## 参考

- [PostgreSQL: Documentation: 15: 9.16. JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [PostgreSQL----JSON和JSONB类型](https://blog.csdn.net/u012129558/article/details/81453640)
