---
title: HerokuDeployerを使った GitHub から heroku への自動デプロイ
category: software
date: 2014/11/10

---

## 動作概要
[HerokuDeployer](https://github.com/himynameisjonas/heroku-deployer)
を参考に。ちと複雑。

役回りは3つ：

- github source：git@github.com:username/xxx-blog.git
- deployer: xxx-deployer.herokuapp.com
- blog: xxx-blog.herokuapp.com

とする。動作としては、

1. ローカルで post などを作成し、ローカルレポに commit
1. github に push (git push origin master)
1. github の hook が働き内容を deployer に渡す
1. それを受けて deployer が blog に deploy する

## 設定

github と blog はすでにあるはずなので、 deployer の作成と三者の接続の設定をする。

### deployer 用 heroku アカウント、アプリの作成
まずblog用のアカウント(username@address.com とする)とは別に、deployer としての heroku アカウントを作成する(username-deployer@address.com とする)。

そのアカウント上で、HerokuDeployer を clone し deployer のherokuアプリも作る。

```
% git clone https://github.com/himynameisjonas/heroku-deployer.git
% cd heroku-deployer
% heroku login
(deployer の e-mail/password を入力）
% heroku create xxx-deployer   # as deployer
% git push heroku master
```

### blog と deployer の接続
まず xxx-blog app と xxx-deployer app を接続する。

#### collaborator の設定
blog用アカウントで heroku の web にログインし、
Personal Apps => xxx-blog => Access => Edit で
deployer用アカウントのメールアドレスを入力し、collaborator に追加する。

#### SSH の設定
blog=deployer をつなぐ SSH Key を作成する。

```
% ssh-keygen -t rsa
(save it to "deploy_rsa")
(empty for passphrase)
```

つなぎ方としては、秘密鍵を deployer に、公開鍵を blog に持たせる。

秘密鍵：

```
% heroku config:set DEPLOY_SSH_KEY="$(cat deploy_rsa)"
```

公開鍵：

heroku の web: username@address.com => Account => SSH Keys => Edit
で deploy_rsa.pub の内容を追加し save。

### deployer - github の接続

続いて deployer app と github のレポをつなげる。

#### SSH の設定
秘密鍵を deployer に、公開鍵を github に持たせる。

```
% ssh-keygen -t rsa
(save it to "blog_rsa")
(empty for passphrase)
```

deploy 側：

```
% heroku config:set xxx-blog_SSH_KEY="$(cat blog_rsa)"
```

github 側：

web: username/xxx-blog repo => settings => Deploy keys => Add Deploy Keys
に blog_rsa.pub の内容を追加。

### secret key の設定

deployer 側：

```
% heroku config:set DEPLOY_SECRET=XXXX  # XXXX は当然秘密のコード
```

### github の web hook の設定

githubのwebから username/xxx-blog repo => settings => Webhooks & Servies に
"https://xxx-deployer.herokuapp.com/deploy/xxx-blog/XXXX"を追加。

これで当該レポに push されたら hook で deployer に更新内容を渡すようになる。

### レポジトリの設定

```
% pwd
heroku-deployer
% heroku config:set xxx-blog_GIT_REPO=ssh://git@github.com/username/xxx-blog
% heroku config:set xxx-blog_HEROKU_REPO=git@heroku.com:xxx-blog.git
```

## 動作確認
適当にポストを追加・修正し commit, git push origin master し、
少し待ってから xxx-blog.herokuapp.com の方に反映されるか確認。

heroku logs を見てみてもよい。

## おまけ

。。。。正直こんなメンドくさいことやらなくても、素直に herokuapp に push したほうがいいような気も。。。prose.io で編集したときは反映されないけど、
一旦 local で origin を pull(fetch+merge) して push heroku すればいいわけだし。
