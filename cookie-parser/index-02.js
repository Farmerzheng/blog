var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();



// cooke - parser的第一个参数可以指定服务器端的提供的加密密匙
app.use(cookieParser('my_cookie_secret'));

// cookie
app.get('/', function(req, res) {
    if (req.signedCookies.isFirst) {
        res.send("欢迎再一次访问");
        console.log(req.signedCookies)
    } else {
        res.cookie('isFirst', 1, {
            maxAge: 10 * 1000,
            signed: true //使用options中的signed配置项可实现加密
        });
        res.send("欢迎第一次访问");
    }
});

app.listen(3040, function() {
    console.log('express start on: ' + 3040)
});