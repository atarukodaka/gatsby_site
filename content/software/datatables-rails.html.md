---
title: Datatable を rails で使う
date: 2017-7-7
---

参考：[Datatable を rails で使う \- Ataru Kodaka Site](http://jetglass.hatenablog.jp/entry/2015/05/27/172831)

## 準備
```
% cat app/view/layout/application.html

html
  head
    // jquery
    script src="https://code.jquery.com/jquery-2.2.4.min.js"
    // bootstrap
    script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
    link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
    // datatable   
    script src="https://cdn.datatables.net/v/bs-3.3.7/jq-2.2.4/dt-1.10.15/datatables.min.js"
    link rel="stylesheet" href="https://cdn.datatables.net/v/bs-3.3.7/jq-2.2.4/dt-1.10.15/datatables.min.css"
```

## HTML DOM
ふつーにHTML でテーブルデータを表示させて、その中でソートやサーチ。

```
% cat app/view/application/_datatable.html.slim
script
  | jQuery(function($){
  | $("##{table_id}").DataTable(
  | );
  | });

- collection ||= []

table
  tr
    th name
    th address
  tr
    - collection.each do |item|
      td= item.name
      td= item.address

% cat app/view/users/index.html.slim
= render partial: 'datatable', locals: { collection: User.all }
```

## Ajax client side

## Ajax server side
データ数が多いときなど、表示させる分だけサーバから取得する。

javascript でサーバーサイドのフラグをオンにし(serverSide: true)、 ajax 取得先を指定する