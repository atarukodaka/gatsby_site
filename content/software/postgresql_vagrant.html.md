---
title: Postgresql を centOS with vagrant で動かす
date: 2015-12-6
---

- Vagrant + CentOS + PostgreSQLを最速で構築 | Unresolved
- PostgreSQL - peer認証の関係でpsqlログインできない時の対処法 - Qiita
- Sinatra✕ActiveRecord✕PostgreSQLでデータベース操作。 - NOT SO BAD

## yum install
```sh
% uname -a
Linux vagrant-centos65.vagrantup.com 2.6.32-431.3.1.el6.x86_64 #1 SMP Fri Jan 3 21:39:27 UTC 2014 x86_64 x86_64 x86_64 GNU/Linux
% yum install -y postgresql postgresql-server postgresql-devel
```

## postgres のパスワードを設定
```sh
% sudo passwd postgres
Changing password for user postgres.
New password:
Retype new password:
```

## config
```
# cd /var/lib/pgsql/data
# vi postgresql.conf
...
# vi pg_hba.conf
host all postgres trust
```
