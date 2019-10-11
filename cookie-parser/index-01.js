var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

// 使用 cookieParser 中间件;
app.use(cookieParser());

// 如果请求中的 cookie 存在 isFirst
// 否则，设置 cookie 字段 isFirst, 并设置过期时间为10秒
app.get('/', function(req, res) {
    if (req.cookies.isFirst) {
        res.send("再次欢迎访问");
        console.log(req.cookies)
    } else {
        res.cookie('isFirst', 1, {
            maxAge: 10 * 1000
        });
        res.send("欢迎第一次访问");
    }
});

app.listen(3030, function() {
    console.log('express start on: ' + 3030)
});