--- 
title: Gitlab CI/CD缓存(Cache)
author: Sieunyue
date: 2023-02-18
description: Gitlab CI/CD缓存(Cache)
tags: 
- Gitlab
--- 

# Gitlab CI_CD缓存(Cache)
## Cache
- 使用`cache`关键字定义每个job的缓存，也可以全局定义，默认禁用
- 后续`pipeline`可以使用缓存。
- 如果依赖关系相同，同一`pipeline`中的下游作业可以使用缓存。
- 默认情况下，受保护和不受保护的分支不共享缓存。但是，您可以更改此[行为](https://docs.gitlab.com/ee/ci/caching/#use-the-same-cache-for-all-branches)。
## Good caching practices
要确保缓存的最大可用性，请执行以下一项或多项操作：

- 定义`runner`的[tag](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#use-tags-to-control-which-jobs-a-runner-can-run)字段，在使用缓存的job上使用`tag`字段
- [使用仅适用于特定项目的](https://docs.gitlab.com/ee/ci/runners/runners_scope.html#prevent-a-project-runner-from-being-enabled-for-other-projects)`runner`
- 在缓存中使用[key](https://docs.gitlab.com/ee/ci/yaml/index.html#cachekey)属性。例如，每个分支配置不同的缓存。
## 例子
缓存`node_modules/`，加快打包时间
```yaml
.comm-job: &comm-job
  tags:
    - rdm_test_docker
  before_script:
    - source ~/.bashrc
    - nvm use default

install:
  <<: *comm-job
  stage: install
  cache:
    key: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}
    paths:
      - node_modules/
    policy: pull-push
  script:
    - npm install
```
## 参考

- [Gitlab docs](https://docs.gitlab.com/ee/ci/caching/#how-cache-is-different-from-artifacts)
