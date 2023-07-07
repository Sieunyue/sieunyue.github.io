--- 
title: Gitlab CI/CD在job间传递变量
author: Sieunyue
date: 2023-02-18
tags: 
- gitlab
--- 

```yaml
build:
  stage: build
  script:
  	- echo "BUILD_VARIABLE=value_from_build_job" >> build.env
  artifacts:
    reports:
    	dotenv: build.env

deploy:
  stage: deploy
  script:
    - env
    - echo "$BUILD_VARIABLE"
```
