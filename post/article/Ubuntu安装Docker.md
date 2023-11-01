--- 
title: Ubuntu安装Docker
author: Sieunyue
date: 2021-09-28
description: Ubuntu安装Docker
tags: 
- Linux
--- 

# Ubuntu安装Docker

## 系统需求
- Ubuntu Lunar 23.04
- Ubuntu Kinetic 22.10
- Ubuntu Jammy 22.04 (LTS)
- Ubuntu Focal 20.04 (LTS)
- Ubuntu Bionic 18.04 (LTS)
## 安装步骤
### 卸载冲突包
```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
```
### 设置软件源

1. 更新`apt`软件包索引，允许`apt`使用https安装软件包
```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
```

2. 导入docker源仓库的 GPG key
```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

3. 添加软件仓库
```bash
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```
### 安装docker
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 参考链接
[Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
