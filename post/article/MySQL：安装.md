--- 
title: MySQL：安装
author: Sieunyue
date: 2022-03-14
description: Ubuntu安装MySQL
tags: 
- Mysql
- Sql
--- 

# MySQL：安装
## 安装
### 使用命令行安装
```bash
#更新源
sudo apt-get update

#安装msql-server
sudo apt-get install mysql-server
```
### 初始化配置
在初始化配置（sudo mysql_secure_installation）前先设置root密码
```bash
root@ubuntu:~# mysql

mysql> alter user 'root'@'localhost' identified with mysql_native_password by 'lovehyy96';
Query OK, 0 rows affected (0.02 sec)
```
然后再初始化配置：
```bash
sudo mysql_secure_installation

#1
VALIDATE PASSWORD PLUGIN can be used to test passwords...
Press y|Y for Yes, any other key for No: N (选择N ,不会进行密码的强校验)

#2
#已经设置过密码了，这步会直接略过！
Please set the password for root here...
New password: (输入密码)
Re-enter new password: (重复输入)

#3
By default, a MySQL installation has an anonymous user,
allowing anyone to log into MySQL without having to have
a user account created for them...
Remove anonymous users? (Press y|Y for Yes, any other key for No) : N (选择N，不删除匿名用户)

#4
Normally, root should only be allowed to connect from
'localhost'. This ensures that someone cannot guess at
the root password from the network...
Disallow root login remotely? (Press y|Y for Yes, any other key for No) : N (选择N，允许root远程连接)

#5
By default, MySQL comes with a database named 'test' that
anyone can access...
Remove test database and access to it? (Press y|Y for Yes, any other key for No) : N (选择N，不删除test数据库)

#6
Reloading the privilege tables will ensure that all changes
made so far will take effect immediately.
Reload privilege tables now? (Press y|Y for Yes, any other key for No) : Y (选择Y，修改权限立即生效)

```
### 检查mysql服务状态
```bash
systemctl status mysql.service
```
### 配置远程登录
修改bind-address
```bash
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```
重启mysql
```bash
sudo /etc/init.d/mysql restart
```
运行远程访问
```bash
root@ubuntu:~# mysql

mysql> use mysql;
mysql> select host,user,plugin from user;

#允许远程访问
mysql> UPDATE user SET host = '%' WHERE user = 'root';

#刷新权限
mysql> flush privileges; 
```
