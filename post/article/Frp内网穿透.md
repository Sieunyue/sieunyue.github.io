--- 
title: Frp内网穿透
author: Sieunyue
date: 2023-09-23
description: 介绍Frp内网穿透工具，可以用来调试微信H5
tags:
- Linux
--- 

# Frp内网穿透
在微信公众号网页开发，可以通过微信网页授权机制，来获取用户基本信息，进而实现业务逻辑。
在微信公众号请求用户网页授权之前，开发者需要先到公众平台官网中的「设置与开发」-「功能设置」-「网页授权域名」的配置选项中，修改授权回调域名。
只有在授权域名中的网页才能使用网页授权，所以在开发的过程中需要使用内网穿透来实现本机调试。
## frp 是什么？
frp 是一个专注于内网穿透的高性能的反向代理应用，支持 TCP、UDP、HTTP、HTTPS 等多种协议，且支持 P2P 通信。
可以将内网服务以安全、便捷的方式通过具有公网 IP 节点的中转暴露到公网。其功能特性包括:

* 客户端服务端通信支持 TCP、QUIC、KCP 以及 Websocket 等多种协议。
* 采用 TCP 连接流式复用，在单个连接间承载更多请求，节省连接建立时间，降低请求延迟。
* 代理组间的负载均衡。
* 端口复用，多个服务通过同一个服务端端口暴露。
* 支持 P2P 通信，流量不经过服务器中转，充分利用带宽资源。
* 多个原生支持的客户端插件（静态文件查看，HTTPS/HTTP 协议转换，HTTP、SOCK5 代理等），便于独立使用 frp 客户端完成某些工作。
* 高度扩展性的服务端插件系统，易于结合自身需求进行功能扩展。
* 服务端和客户端 UI 页面。

## 概念
frp 主要由 客户端(frpc) 和 服务端(frps) 组成，服务端通常部署在具有公网 IP 的机器上，客户端通常部署在需要穿透的内网服务所在的机器上。
内网服务由于没有公网 IP，不能被非局域网内的其他用户访问。
用户通过访问服务端的 frps，由 frp 负责根据请求的端口或其他信息将请求路由到对应的内网机器，从而实现通信。

## 下载&部署
目前可以在 Github 的 [Release](https://github.com/fatedier/frp/releases) 页面中下载到最新版本的客户端和服务端二进制文件。
解压缩下载的压缩包，将其中的 frpc 拷贝到内网服务所在的机器上，将 frps 拷贝到具有公网 IP 的机器上，放置在任意目录
```shell
# 启动服务端
./frps -c ./frps.ini 
# 启动客户端
./frpc -c ./frpc.ini
```

## 配置(http代理)
### 服务端配置
修改frps.ini文件
```text
[common]
# 绑定的端口 客户端连接所需要的端口号
bind_port = 7000
# http端口 外部访问的端口，外部访问http://xxxx:8080就会代理到内网上
vhost_http_port = 8080
# 客户端连接所需的token
token = xxxxx
```

### 客户端配置
```text
[common]
# 服务端ip地址
server_addr = xxx.xx.xx.xx

# 服务端端口号 服务端配置里的bind_port
server_port = 7000

# 服务端端口
token = gxwzsz2023

[http]
# 代理类型
type = http

# 本地端口号 要访问的内网web服务端口
local_port = 3000

# 自定义域名，只有通过这个域名访问才会穿透到内网
# domains.com:8080 可以访问内网3000端口的web服务
# domains1.com:8080 是不能穿透的
custom_domains = domains.com
```

## 参考链接
[frp](https://gofrp.org/)

