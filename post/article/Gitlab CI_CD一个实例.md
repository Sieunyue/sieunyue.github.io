--- 
title: Gitlab CI/CD一个实例
author: Sieunyue
date: 2023-02-18
description: Gitlab CI/CD一个实例
tags: 
- Gitlab
--- 

# gitlab-ci.yml实例

```yaml
workflow:
  rules:
    - if: $CI_COMMIT_BRANCH == "master" && $CI_COMMIT_MESSAGE =~ /release.*/
      when: always
    - if: $CI_COMMIT_BRANCH == "dev_next"
      when: always
    - when: never

stages:
  - pre-install
  - install
  - build
  - deploy

cache:
  key: ${CI_PROJECT_NAME}_${CI_COMMIT_REF_NAME}
  paths:
    - node_modules/

.comm-job: &comm-job
  tags:
    - rdm_test_docker
  before_script:
    - source ~/.bashrc
    - nvm use default

pre@dev:
  <<: *comm-job
  stage: pre-install
  only:
    - dev_next
  script:
    - echo "PASSWORD=$CI_RDM_TEST_PASSWD" >> build.env
    - echo "IP=$CI_RDM_TEST_IP" >> build.env
    - echo "DIR=$CI_RDM_TEST_PATH" >> build.env
  artifacts:
    reports:
      dotenv: build.env

pre@prod:
  <<: *comm-job
  stage: pre-install
  only:
    - master
  script:
    - echo "PASSWORD=$CI_RDM_PROD_PASSWD" >> build.env
    - echo "IP=$CI_RDM_PROD_IP" >> build.env
    - echo "DIR=$CI_RDM_PROD_PATH" >> build.env
  artifacts:
    reports:
      dotenv: build.env

install:
  <<: *comm-job
  stage: install
  script:
    - npm install

build:
  <<: *comm-job
  stage: build
  script:
    - npm run build # 运行构建命令
  artifacts: # 把 dist 的内容传递给下一个阶
    paths:
      - dist/

deploy:
  <<: *comm-job
  stage: deploy
  script:
    - sshpass -p "$PASSWORD" scp -r dist root@$IP:$DIR

```
