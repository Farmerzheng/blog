/*
     首先Cookie和Session都是为了状态管理，
     
     HTTP协议是无状态的，不能保存每次提交的信息，即当服务器返回与请求相对应的应答之后，这次事务的所有信息就丢掉了。 
　　
     如果用户发来一个新的请求，服务器无法知道它是否与上次的请求有联系。 

　　 对于那些需要多次提交数据才能完成的Web操作，就成问题了。

     所以需要状态管理也就是通过Cookie和Session。

一.Cookie

1. 什么是Cookie？ 
　　 用我的理解来说，浏览器A在第一次请求服务器B的时候，服务器B会为该浏览器A创建一个Cookie，并在响应时候把这个Cookie一同返回给浏览器A，这样A在请求数据不变的情况下再次请求服务器B的时候会带着这个Cookie，这样服务器B当接收A请求时会辨识出这个Cookie,明白A是访问过B的并可能存储着属于A的数据（在这个过程中存在着session的问题稍后讲解）。

2. Cookie持续多久呢？ 
可以通过setMaxAge（）方法设置Cookie存在时间。



session数据存储空间一般是在内存中开辟的，那么在内存中的session显然是存在极大的数据丢失的隐患的，比如系统掉电，所有的会话数据就会丢失，如果是证券交易所那么这种后果的严重性可想而知。所以为了解决这个问题可以将session持久化保存，比如保存到数据库。session持久化保存到mongoDB的需要用到工具connect-mongo

使用express - session来保存登录状态

1） 什么是session ?

    由于HTTP是无状态的， 所以服务器在每次连接中持续保存客户端的私有数据此时需要结合cookie技术。 通过session 会话机制， 在服务器端保存每个http请求的私有数据。

2） session原理

在服务器内存中开辟一块地址空间， 专门存放每个客户端的私有数据， 每个客户端根据cookie中保持的sessionId， 可以获取到session数据。

express - session 是expressjs的一个中间件用来创建session。 服务器端生成了一个sessionn - id， 客户端使用了cookie保存了session - id这个加密的请求信息， 而将用户请求的数据保存在服务器端
    */

/*session放在服务器端。 当浏览器关闭就会清空。 session时间不宜设置过长， 否则大量占用服务器内存。 cookie适合长时间保存， 在登出时被清除。验证用户是否登录的逻辑：


1) 用户密码登录时， 在后台的req中记住session.

2) 如果用户保存登录密码， 则记住cookie， 否则把当前用户的cookie设置为空;

3) 每次用户需要向后台进行请求时， 进行状态检验：

session是否存在？ 若存在， 则继续进行请求操作， 并将session的有效时间重新设置一次；

若不存在， 则判断cookie是否存在 ? 若存在， 使用该cookie完成自动登录， 即完成了一次1);

若不存在， 则页面重定向到登录页面。

上面的验证逻辑有了。 那么在什么地方进行验证呢？ 总不能在每次进行请求的地方都进行一遍这样的验证吧？ 无论是放在前端的调用， 中间的路由， 或者后台的操作上， 显然都显得太过冗沉。

经过一番资料查询， 我找到了方法：

对所有的后端请求进行拦截

app.use(function (req, res, next) {
    if (req.session.login_account) { // 判断用户session是否存在  
        next();
    } else {

        var arr = req.url.split('/');
        for (var i = 0, length = arr.length; i < length; i++) {
            arr[i] = arr[i].split('?')[0];
        }

        // 判断请求路径是否为根、登录、注册、登出，如果是不做拦截
        if (arr.length > 2 && arr[0] == '' && arr[1] == 'operlogin' && arr[2] == 'checklogin' || arr[2] == 'login') {
            next();
        } else {
            // req.session.originalUrl = req.originalUrl ? req.originalUrl : null;  // 记录用户原始请求路径
            res.redirect("index2.html#/operlogin");
        }
    }
});
*/

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const config = require('./config');
const http = require('http');

//需要推送的网站链接

setInterval(function() {
    var content = "http://www.91alex.com";
    //对应配置post推送的接口说明
    var options = {
        host: "data.zz.baidu.com",
        path: 'http://data.zz.baidu.com/urls?site=www.91alex.com&token=jIODL3goMqJMLzrB', //接口的调用地址
        method: "post",
        "User-Agent": "curl/7.12.1",
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": content.length
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding("utf8");
        res.on("data", function(data) {
            console.log("baidu engine data:", data); //返回的数据
        });
    });
    req.write(content);
    req.end();
}, 10000000)




// 引入路由
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var publishRouter = require('./routes/publish');
var registerRouter = require('./routes/register');
var uploadRouter = require('./routes/upload');
var collectRouter = require('./routes/collect');
var payRouter = require('./routes/pay');
var shareRouter = require('./routes/weixin');
var qqLoginRouter = require('./routes/qq_login');
var app = express();


/*
在使用mongodb存储session时首先要加载模块：connect-mongo以及mongoose
*/
var mongoose = require("mongoose");
// 引入express-session中间件，req上面会增加session属性
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// mongoose以非授权的方式启动
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
/*链接成功*/
mongoose.connection.on("connected", function() {
        console.log("mongodb connected success");
    })
    /* 链接失败*/
mongoose.connection.on("error", function() {
        console.log("mongodb connected fail");
    })
    /* 断开链接*/
mongoose.connection.on("disconnected", function() {
    console.log("mongodb connected disconnected");
})

// cookie  解析的中间件
// app.use(cookieParser(config.cookieSecret)); //与session 中的 secret 一致

//express-session 的主要的方法是 session(options)
app.use(session({
    /* secret 的值建议使用随机字符串,通过设置的 secret 字符串， 来计算 hash值并放在 cookie 中， 使产生的 signedCookie 防篡改。为了安全性的考虑设置secret属性*/
    secret: config.cookieSecret,
    // name: config.db, //设置cookie中，保存session的字段名称，默认为connect.sid
    /**
    设置存放 session id 的 cookie 的相关选项， 默认为
        (default: {
                path: ‘ /’, 
                httpOnly: true,
                secure: false,
                maxAge: null
         })
     */
    // 使用cookie配置项, 可以将session数据保存在cookie中
    cookie: {
        //存储时间
        maxAge: 1000 * 60 * 60 * 24 * 14
    },
    resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
    saveUninitialized: false, //强制未初始化的session保存到数据库
    // store: session 的存储方式， 默认存放在内存中， 也可以使用 redis， mongodb 等。
    store: new MongoStore({
        mongooseConnection: mongoose.connection //使用已有的数据库连接
    })
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// 对所有的后端请求进行拦截，特别注意，要放在
app.use(function(req, res, next) {

    // 判断用户session是否存在  
    // if (req.session.user) {
    //     next();
    // } else {

    //     var arr = req.url.split('/');

    //     for (var i = 0, length = arr.length; i < length; i++) {
    //         arr[i] = arr[i].split('?')[0];
    //     }

    //     // 判断请求路径是否为根、登录、注册、登出，如果是不做拦截
    //     if (arr.length > 2 && arr[1] == 'view' || arr[2] == 'login' || arr[2] == 'register' || arr[1] == 'pictureList' || arr[1] == 'pictureType') {
    //         next();
    //     } else {
    //         // req.session.originalUrl = req.originalUrl ? req.originalUrl : null;  // 记录用户原始请求路径
    //         res.redirect("/view/");
    //     }
    // }
    next();
});


app.use('/', indexRouter);
app.use('/publish', publishRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/upload', uploadRouter);
app.use('/collect', collectRouter);
app.use('/pay', payRouter);
// 用户登录了就没有访问注册页面的权利
app.use('/register', registerRouter);
// 分享接口
app.use('/weixin_action', shareRouter);
// qq登录
app.use('/qq_login', qqLoginRouter);

app.use(express.static(path.join(__dirname, 'public')));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
});



module.exports = app;