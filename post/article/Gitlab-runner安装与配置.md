--- 
title: Gitlab-runner安装与配置
author: Sieunyue
date: 2023-02-18
description: Gitlab-runner安装与配置
tags: 
- Gitlab
--- 

[参考文档](https://docs.gitlab.com/runner/install/)
## 安装
```shell
//创建配置文件
mkdir -p /data/gitlab-runner/config

//运行docker
docker run \
-d \
--name gitlab-runner \
--restart always \
-p 8093:8093 \
-v /data/gitlab-runner/config:/etc/gitlab-runner \
-v /var/run/docker.sock:/var/run/docker.sock \
--env TZ=Asia/Shanghai \
gitlab/gitlab-runner:latest
```
## 配置
进入docker执行
```bash
docker exec -it gitlab-runner /bin/bash

gitlab-runner register
```
注册分为8步骤:

1. Enter your GitLab instance URL (also known as the gitlab-ci coordinator URL).
2. Enter the token you obtained to register the runner.
3. Enter a description for the runner. You can change this value later in the GitLab user interface.
4. Enter the [tags associated with the runner](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gitlab.com%2Fee%2Fci%2Frunners%2Fconfigure_runners.html%23use-tags-to-control-which-jobs-a-runner-can-run), separated by commas. You can change this value later in the GitLab user interface.
5. Enter any optional maintenance note for the runner.
6. Provide the [runner executor](https://link.juejin.cn?target=https%3A%2F%2Fdocs.gitlab.com%2Frunner%2Fexecutors%2Findex.html). For most use cases, enter docker.
7. If you entered docker as your executor, you are asked for the default image to be used for projects that do not define one in .gitlab-ci.yml
> **gitlab-runner tag：**
> 1. 多个runner可以使用同一个tag
> 2. 一个runner可以配置多个tag
> 
.gitlab-ci.yml中根据tag字段指定runner



