---
title: Togetter からテキストのみを抽出するやつ（togetter2text.rb）
date: 2015-02-13
category: software
---

「残りを読む」のajax がうざくて素直にいかない。
http://h3poteto.hatenablog.com/entry/2013/10/20/135403 を試してみたが
いまいち上手くいかないのでちょいと手直し（csrf_secret を get で撮り直さず最初の open() の meta を再利用）。

~~~
 % ruby togetter2text.rb <togetter-url>
~~~

でいけます。

<script src="https://gist.github.com/atarukodaka/03da7e9563069bece9aa.js"></script>
