/*

一、 cookie：

在网站中， http请求是无状态的。 也就是说即使第一次和服务器连接并且登录成功后， 第二次请求服务器依然不能知道当前请求是哪个用户。 cookie的出现就是为了解决这个问题， 第一次登录后服务器返回一些数据（ cookie） 给浏览器， 然后浏览器保存在本地， 当该用户发送第二次请求的时候， 就会自动的把上次请求存储的cookie数据自动的携带给服务器， 服务器通过浏览器携带的数据就能判断当前用户是哪个了。 cookie存储的数据量有限， 不同的浏览器有不同的存储大小， 但一般不超过4KB。 因此使用cookie只能存储一些小量的数据。

二、 session:

session和cookie的作用有点类似， 都是为了存储用户相关的信息。 不同的是， cookie是存储在本地浏览器， 而session存储在服务器。 存储在服务器的数据会更加的安全， 不容易被窃取。 但存储在服务器也有一定的弊端， 就是会占用服务器的资源， 但现在服务器已经发展至今， 存储一些session信息还是绰绰有余的。

三、 cookie和session结合使用：
web开发发展至今， cookie和session的使用已经出现了一些非常成熟的方案。 在如今的市场或者企业里， 一般有两种存储方式：

1、 存储在服务端： 通过cookie存储一个session_id， 然后具体的数据则是保存在session中。 如果用户已经登录， 则服务器会在cookie中保存一个session_id， 下次再次请求的时候， 会把该session_id携带上来， 服务器根据session_id在session库中获取用户的session数据。 就能知道该用户到底是谁， 以及之前保存的一些状态信息。 这种专业术语叫做server side session。

2、 将session数据加密， 然后存储在cookie中。 这种专业术语叫做client side session。 

express-session 是express的一个中间件，用来创建session。 

express-session支持session存放位置

session默认存放在内存中， 存放在cookie中安全性太低， 存放在非redis数据库中查询速度太慢， 一般项目开发中都是

存放在redis中(缓存数据库)。

*/
var path = require('path');
var express = require('express');
var session = require('express-session');
var app = express();


/*
session() 的参数options配置项主要有：

name: 设置cookie中， 保存session的字段名称， 默认为connect.sid
store: session的存储方式， 默认为存放在内存中， 我们可以自定义redis等
genid: 生成一个新的session_id时， 默认为使用uid2这个npm包
rolling: 每个请求都重新设置一个cookie， 默认为false
resave: 即使session没有被修改， 也保存session值， 默认为true
saveUninitialized： 强制未初始化的session保存到数据库
secret: 通过设置的secret字符串， 来计算hash值并放在cookie中， 使产生的signedCookie防篡改
cookie: 设置存放sessionid的cookie的相关选项
*/

app.use(session({
    name: 'session-name',
    secret: 'my_session_secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000,
        httpOnly: true
    }
}));

// route
app.get('/', function(req, res, next) {
    if (req.session.isFirst || req.cookies.isFirst) {
        res.send("欢迎再一次访问");
    } else {
        req.session.isFirst = 1;
        res.cookie('isFirst', 1, {
            maxAge: 60 * 1000,
            singed: true
        });
        res.send("欢迎第一次访问。");
    }
});

app.listen(3030, function() {
    console.log('express start on: ' + 3030)
});