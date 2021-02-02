---
title: ランダムオーダー：スコアシートでのジャッジの表示順は選手ごとに異なるか？
date: 2015-02-27
category: figureskating
---

## 選手ごとのジャッジの表示の並び順
GPシリーズ、オリンピック、ワールドなどでは、「ランダムオーダー」が採択され、
どのジャッジがどのスコア（GOE, PCS）を付与したかが明らかにされない。
具体的には、オフィシャル発表でのジャッジ並び順と、スコアシートでの並び順は異なる。

それでは、選手のスコアシートごとにジャッジに表示順は異なるのだろうか？あるいは縦軸は同一なのだろうか？

関連：[「ジャッジの匿名性」についてのまとめ（まとめ中） - 小高あたるの日記](http://d.hatena.ne.jp/ataru_kodaka/20130402/1364914303)

## ランダムオーダーの定義
[Special Regulatins & Technical Rules](http://static.isu.org/media/166717/2014-special-regulation-sandp-and-ice-dance-and-technical-rules-sandp-and-id_14-09-16.pdf)

Rule 353.4.c)

~~~
For ISU Championships, Olympic Winter Games, Senior Grand Prix of Figure Skating Events and Final, the Judges’ marks are listed in a random sequence without any reference to specific Judges’ names (anonymity).
~~~

あくまで「ランダム順にリストされ、ジャッジ名とヒモ付られない」とされているだけで、
選手ごとに入れ替えること、とまでは規定されていない。
が、同時に縦軸を揃えることとも規定されていないため、

- 仕様：縦軸が同一であるとは保証されない
- 実装：選手毎にシャッフル

ということか。


## 実例
thx to @winter026, @verona_london 

### Skate America 2009
http://www.isuresults.com/results/gpusa09/gpusa09_Men_FS_Scores.pdf

欠席ジャッジの表示位置が選手ごと異なる。かなり決定的。

### JGPF 2014
http://www.isuresults.com/results/gpf1415/gpf1415_JuniorMen_SP_Scores.pdf

あくまで推量：TR/INに異常に低い点を付けるジャッジが同一の縦軸にきていない：

- 一番右：Rank1#10 3.75/4.00
- 左から二番目： Rank4#2: 3.75/4.25

## 結論

おそらく選手ごとシャッフルされてる。
