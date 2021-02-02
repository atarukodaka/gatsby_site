---
title: postfix で gmail経由でメールを送る
date: 2017-5-15

---

```
% sudo yum install postfix cyrus-sasl
% sudo chkconfig -add postfix
% sudo chkconfig postfix on
```

```
relayhost = [smtp.gmail.com]:587
#sasl setting
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_sasl_tls_security_options = noanonymous
smtp_sasl_mechanism_filter = plain
#tls setting
smtp_use_tls = yes
```

## 参考サイト
- http://qiita.com/blueinkinc/items/0907ee3312ed9d79c9e8
- http://qiita.com/taiti/items/8f9e75a045b3d86d16ea
- http://kkv.hatenablog.com/entry/2015/06/12/001436
- http://structured-p.info/server/184