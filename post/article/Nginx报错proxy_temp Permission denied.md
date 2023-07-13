--- 
title: Nginx报错proxy_temp Permission denied 
author: Sieunyue
date: 2023-07-11
tags: 
- Linux
- Nginx
--- 

# Nginx报错proxy_temp Permission denied
生产服务器的某些接口突然不能访问，把代码拉到本地启动又是正常。怀疑是nginx的问题，查看nginx日志，提示如下

`tail -f 1000 /usr/local/nginx/logs/error.log`

```xml
2023/07/11 17:46:37 [crit] 24459#0: *117 open() "/usr/local/nginx/proxy_temp/5/01/0000000015" failed (13: Permission denied) while reading upstream...
```

日志提示nginx没有访问权限

查看nginx用户

`ps aux | grep nginx`

`worker process`用户是nobody

查看文件夹权限，所属用户为root

打开nginx配置文件，将`#user nobody`改为`user root`

重启nginx服务

访问接口，正常请求
