--- 
title: PostgreSQL：开启WAL
author: Sieunyue
date: 2022-03-14
tags: 
- postgresql
- sql
--- 

## 正文
### 开启WAl
要在 PostgreSQL 中启用 WAL（Write-Ahead Logging），可以按照以下步骤进行操作：

1.  打开终端或命令行界面。 
2.  导航到 PostgreSQL 的数据目录。默认情况下，数据目录位于 `/var/lib/postgresql/<version>/data`（Linux）或 `C:\Program Files\PostgreSQL\<version>\data`（Windows）。 
3.  打开 `postgresql.conf` 文件。可以使用文本编辑器（例如，vim、nano、Notepad++等）打开该文件。 
4.  在 `postgresql.conf` 文件中查找并编辑以下配置项： 
```shell
wal_level = replica
max_wal_senders = <number_of_senders>
checkpoint_timeout = <timeout_in_seconds>
```
 

   - 将 `wal_level` 设置为 `replica`，表示启用 WAL，并允许逻辑复制和流复制。
   - `<number_of_senders>` 是允许的最大 WAL 发送者数量。根据你的需求，将其设置为适当的值。例如，如果你计划使用逻辑复制，可以设置为较高的值（例如 10）；如果只使用流复制，可以设置为较低的值（例如 2）。
   - `<timeout_in_seconds>` 是触发自动检查点操作的超时时间。这将影响 WAL 文件的生成和清理频率。根据你的需求，将其设置为适当的值（以秒为单位）。
5.  保存并关闭 `postgresql.conf` 文件。 
6.  重新启动 PostgreSQL 服务器，以使配置更改生效。可以使用适当的命令或脚本来启动服务器。例如，在终端或命令行中执行以下命令： 
```shell
pg_ctl start -D /path/to/postgresql/data
```

其中 `/path/to/postgresql/data` 是你 PostgreSQL 数据目录的路径。 
现在，WAL 已经在 PostgreSQL 中启用并按照你的配置进行工作。WAL 将记录数据库的变更，以确保数据的持久性和一致性。
### 逻辑复制和流复制
在 PostgreSQL 中，逻辑复制和流复制是两种常用的数据复制和同步技术。它们都用于实现高可用性、数据备份、数据分发和数据一致性等方面。

**逻辑复制(Logical)**：
逻辑复制是一种基于逻辑级别的数据复制技术。它通过解析 WAL（Write-Ahead Logging）中的日志记录，将变更数据转换为逻辑格式，并通过逻辑复制流将这些变更传输到目标服务器。逻辑复制支持将特定的表、特定的数据操作（插入、更新、删除等）或特定的数据库进行复制。它提供了更高的灵活性和精细的控制，可以选择性地复制所需的数据。

**流复制(Replica)**：
流复制是一种基于物理级别的数据复制技术。它通过在源服务器上持续地捕获和传输 WAL 日志文件中的数据更改，将数据流传输到一个或多个目标服务器。目标服务器接收到的数据流会按照相同的顺序应用于其本地数据库，从而保持与源数据库的一致性。流复制复制整个数据库的所有变更，它是一种异步复制方式，适用于需要实时或近实时数据复制的场景。

区别：

- 数据格式：逻辑复制在传输过程中将变更数据转换为逻辑格式，而流复制传输的是原始的物理级别的 WAL 日志。
- 精细度：逻辑复制可以选择性地复制特定的表、数据操作或数据库，提供更高的精细度和灵活性。而流复制复制整个数据库的所有变更。
- 目标数据库版本：逻辑复制在 PostgreSQL 9.4 及更高版本中可用，而流复制可以在较旧的版本中使用，例如 PostgreSQL 9.0 及更高版本。
- 目标服务器要求：逻辑复制要求目标服务器上安装相应的逻辑复制插件，而流复制对目标服务器的要求较低。

选择逻辑复制还是流复制取决于你的具体需求。如果你需要灵活性、选择性复制和更高的精细度控制，逻辑复制是一个不错的选择。如果你需要实时或近实时的数据复制，并且对整个数据库的变更都感兴趣，那么流复制可能更适合你。
### 查看WAL状态

1.  运行以下 SQL 命令来查看 WAL 的开启状态： 
```sql
SHOW wal_level;
```

这将返回一个结果，其中包含当前的 WAL 级别设置。WAL 级别可以是以下之一： 

   - `minimal`：表示 WAL 仅记录必要的信息，用于崩溃恢复。
   - `replica`：表示 WAL 记录足够的信息，用于实现流复制和逻辑复制。
   - `logical`：表示 WAL 记录了用于流复制和逻辑复制的详细逻辑变更。

如果返回结果中显示的是你预期的 WAL 级别，则表示 WAL 已经开启并处于预期状态。 

4.  可以继续运行以下 SQL 命令来查看其他与 WAL 相关的配置： 
```sql
SHOW max_wal_senders;
SHOW checkpoint_timeout;
```

这些命令将分别返回当前的最大 WAL 发送者数量和检查点超时时间设置。 


