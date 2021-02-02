---
title: s5 でスライドショー作って gh-pages に deploy する
date: 2015-02-16
category: software
---


## s5 のインストール

~~~
% sudo gem install slideshow
% slideshow install s5blank
% vi foo.md
Title: title
Author: your name

# Hello
asef

# hoge
- saef
- efse
% slideshow build foo.md -t s5blank
....
~~~



