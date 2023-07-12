--- 
title: PostgreSQL：Function
author: Sieunyue
date: 2022-03-14
tags: 
- postgresql
- sql
--- 

## 正文
### SQL自定义函数模板
[CREATE FUNCTION](http://postgres.cn/docs/12/sql-createfunction.html)
```sql
create or replace function_name() returns numeric $$$$ language sql;
create or replace function_name() returns text $$$$ language plpgsql;
create or replace function_name() returns Table(column_name type) $$$$ language sql;
create or replace function_name() returns setof table|type $$$$ language sql;
create or replace function_name() returns table $$$$ language plpython3u
```

### 变量
变量在`DECLARE`代码块中定义，需要指定变量类型
```sql
CREATE FUNCTION sum(integer, integer)
RETURNS integer AS $BODY$
DECLARE
	num integer;
BEGIN
	num := $1 + $2
	RETURN num;
END
$BODY$
LANGUAGE plpgsql;
```
初始化默认值
```sql
CREATE FUNCTION sum(integer, integer)
RETURNS integer AS $BODY$
DECLARE
	num integer := 1;
BEGIN
	num := $1 + $2
	RETURN num;
END
$BODY$
LANGUAGE plpgsql;
```


### 入参
#### 参数已知
显示定义参数名称
```sql
CREATE FUNCTION sum(x integer, y integer)
RETURNS integer AS $BODY$
BEGIN
	RETURN x + y;
END
$BODY$
LANGUAGE plpgsql;

SELECT add_em(1, 2) AS answer;

 answer
--------
      3
```
省略参数名称
```sql
CREATE FUNCTION sum(integer, integer)
RETURNS integer AS $BODY$
BEGIN
	RETURN $1 + $2;
END
$BODY$
LANGUAGE plpgsql;



SELECT sum(1, 2) AS answer;

 answer
--------
      3

```
#### 未知参数数量
```sql
CREATE FUNCTION mleast(VARIADIC arr numeric[]) 
RETURNS numeric AS $BODY$
BEGIN
	SELECT min($1[i]) FROM generate_subscripts($1, 1) g(i);
END
$BODY$ 
LANGUAGE plpgsql;

SELECT mleast(10, -1, 5, 4.4);
mleast 
--------
-1
(1 row)
```
#### 参数默认值
```sql
CREATE FUNCTION foo(a int, b int DEFAULT 2, c int DEFAULT 3)
RETURNS int
```


### 函数返回值
[37.5. 查询语言（SQL）函数](http://www.postgres.cn/docs/12/xfunc-sql.html#XFUNC-SQL-FUNCTIONS-RETURNING-TABLE)
#### 返回非集合类型
如果sql函数内是sql语句的列表，也就是language为sql的情况下，则返回sql函数内的最后一个查询结果的第一行。所谓的非集合情况，就是调用函数后，直接获得函数体内查询结果的第一行，或者整个计算结果直接返回的情形。如果最后一个查询根本不返回行，就会返回空值。
具体来说，比如你希望依仗一个求和函数实现一个复杂的求和场景，你期望得到的表格的某一列的计算过程是通过一个求和公式得到，函数定义为sum_type1，然后你求和的过程，就是select sum_type1() from xxxx;或者select sum_type1();
**这个非集合情况，具体可以执行以下操作:**
##### (1) 使用函数返回某一列的第一行的结果
可以返回数字类型numeric、text、varchar或interger等
##### (2) 使用定义好的函数去执行一个动作
但是不能在SQL函数中使用事务控制命令，例如COMMIT、SAVEPOINT，以及一些工具命令，例如VACUUM ，update等可以，如果使用了依赖库，要确保当前的数据库的连接方式下，你是有对应权限的，而且不能在里面执行危险的操作。
##### (3) 返回空
只有函数定义的时候定义了返回值为void类型，才可以主动返回空。

#### 返回集合类型
返回为集合类型的情况，我的理解和测试的过程中，主要有两种用法：
##### (1)预期得到的表的列是已知的
将预想要得到的表直接返回，且在定义函数的时候如果方便直接去写返回表格的每一列，直接通过案例来介绍，可以这样定义，但是只会返回一行的情形：
```sql
CREATE FUNCTION sum_n_product_with_tab (x int)
RETURNS TABLE(sum int, product int) AS $$
SELECT $1 + tab.y, $1 * tab.y FROM tab;
$$ LANGUAGE SQL;
```
##### (2)预期得到的表是一个需要维护的模板【匿名组合类型】
有两种定义方式，returns setof table或者returns setof type，定义方式是这样：
比如上面那个案例，如果已知一个表格table1或者type1，table1的每一列和上面那个返回的table一致，
```sql
CREATE FUNCTION sum_n_product_with_tab (x int)
RETURNS setof table1 AS $$
SELECT $1 + tab.y, $1 * tab.y FROM tab;
$$ LANGUAGE SQL;
```
这种情况下定义的函数，调用成功后，会逐行返回一个表，如果使用plpython3u框架，将函数的返回值设置为一个yield类型就可以。yield的结果可以是与返回值映射的字典，或者顺序一致的列表就可以。
### 
### 条件表达式
#### IF...ELSE...
```sql
IF expression THEN
	statement_list
ELSE
	statement_list
END IF;
```
### 
### 循环
#### LOOP
```sql
FOR var IN (SELECT * FROM table) LOOP
	statement_list
END LOOP;
```
## 
## 参考

- [PostgreSQL如何自定义函数（一） - 掘金](https://juejin.cn/post/7086066795198545934)
- [PostgreSql自定义函数语法](https://zhuanlan.zhihu.com/p/602918014)
