/*
c什么是cookie

Cookie设计的初衷是 维持浏览器和服务端的状态。 http是无状态的， 服务端不能跟踪客户端的状态。 浏览器第一次向服务器发送请求， 服务器会返回一个cookie给客户端浏览器， 浏览器下一次发送请求时， 会携带cookie。

cookie-parser
作用： 方便操作客户端中的cookie值
1、安装cookie - parser第三方cookie操作模块

npm install cookie - parser - S

2、引入

const cookieParser = require('cookie-parser');
app.use(cookieParser('123456')); //使用cookie-parser中间件，传入签名123456进行加密

3、设置cookie, 需要设置signed签名

res.cookies('key', 'value', option)

*/

/*
第一部分 session概述
1.1 session 是什么 ?

    Session一般译作会话， 牛津词典对其的解释是进行某活动连续的一段时间。 在web应用的用户看来， session是另一种记录客户状态的机制， 不同的是Cookie保存在客户端浏览器中， 而session保存在服务器上。
    
    客户端浏览器访问服务器的时候， 服务器把客户端信息以某种形式记录在服务器上.客户端浏览器再次访问时只需要从该Session中查找该客户的状态就可以了。

    基本原理是服务端为每一个session维护一份会话信息数据, 而客户端和服务端依靠一个全局唯一的标识来访问会话信息数据。 用户访问web应用时， 服务端程序决定何时创建session， 创建session可以概括为三个步骤：

    1. 生成全局唯一标识符（ sessionid）；
    2. 开辟数据存储空间。 一般会在内存中创建相应的数据结构， 但这种情况下， 系统一旦掉电， 所有的会话数据就会丢失， 如果是电子商务网站， 这种事故会造成严重的后果。 不过也可以写到文件里甚至存储在数据库中， 这样虽然会增加I / O开销， 但session可以实现某种程度的持久化， 而且更有利于session的共享；
    3. 将session的全局唯一标示符发送给客户端。

    session和cookie 优缺点和各自的应用场景：

    1. 应用场景
    Cookie的典型应用场景是Remember Me服务， 即用户的账户信息通过cookie的形式保存在客户端， 当用户再次
    请求匹配的URL的时候， 账户信息会被传送到服务端， 交由相应的程序完成自动登录等功能。 当然也可以保存
    一些客户端信息， 比如页面布局以及搜索历史等等。
    Session的典型应用场景是用户登录某网站之后， 将其登录信息放入session， 在以后的每次请求中查询相应
    的登录信息以确保该用户合法。 当然还是有购物车等等经典场景；

    2. 安全性
    cookie将信息保存在客户端， 如果不进行加密的话， 无疑会暴露一些隐私信息， 安全性很差， 一般情况下敏
    感信息是经过加密后存储在cookie中， 但很容易就会被窃取。 而session只会将信息存储在服务端， 如果存
    储在文件或数据库中， 也有被窃取的可能， 只是可能性比cookie小了太多。
    Session安全性方面比较突出的是存在会话劫持的问题， 这是一种安全威胁。 总体来讲， session的安全性
    要高于cookie；

    3. 性能
    Cookie存储在客户端， 消耗的是客户端的I / O和内存， 而session存储在服务端， 消耗的是服务端的资源。
    但是session对服务器造成的压力比较集中， 而cookie很好地分散了资源消耗， 就这点来说， cookie是要优于session的；

    4. 时效性
    Cookie可以通过设置有效期使其较长时间内存在于客户端， 而session一般只有比较短的有效期（ 用户主动销毁
    session或关闭浏览器后引发超时）；
    
    5. 其他
    Cookie的处理在开发中没有session方便。 而且cookie在客户端是有数量和大小的限制的， 而session的大小
    却只以硬件为限制， 能存储的数据无疑大了太多。
    
    Session工作的大致步骤

    1. 用户提交包含用户名和密码的表单， 发送HTTP请求。
    2. 服务器验证用户发来的用户名密码。
    3. 如果正确则把当前用户名（ 通常是用户对象） 存储到redis中， 并生成它在redis中的ID。
    这个ID称为Session ID， 通过Session ID可以从Redis中取出对应的用户对象， 敏感数据（ 比如authed = true） 都存储在这个用户对象中。
    4. 设置Cookie为sessionId = xxxxxx | checksum并发送HTTP响应， 仍然为每一项Cookie都设置签名。
    5. 用户收到HTTP响应后， 便看不到任何敏感数据了。 在此后的请求中发送该Cookie给服务器。
    6. 服务器收到此后的HTTP请求后， 发现Cookie中有SessionID， 进行放篡改验证。
    7. 如果通过了验证， 根据该ID从Redis中取出对应的用户对象， 查看该对象的状态并继续执行业务逻辑。


Session中包含的数据不会保存在cookie中,仅仅是在cookie中保存了一个SessionId而已.实际的session的数据保存在服务端.

简单理解就是一个Map,键对应的是session id值保存在cookie中,值对应的是用户保存在服务端的数据.

session数据存储空间一般是在内存中开辟的，那么在内存中的session显然是存在极大的数据丢失的隐患的，比如系统掉电，所有的会话数据就会丢失，如果是证券交易所那么这种后果的严重性可想而知。所以为了解决这个问题可以将session持久化保存，比如保存到数据库。session持久化保存到mongoDB的需要用到工具connect-mongo

使用express - session来保存登录状态

1） 什么是session ?

    由于HTTP是无状态的， 所以服务器在每次连接中持续保存客户端的私有数据此时需要结合cookie技术。 通过session 会话机制， 在服务器端保存每个http请求的私有数据。

2） session原理

在服务器内存中开辟一块地址空间， 专门存放每个客户端的私有数据， 每个客户端根据cookie中保持的sessionId， 可以获取到session数据。

express - session 是expressjs的一个中间件用来创建session。 服务器端生成了一个sessionn - id， 客户端使用了cookie保存了session - id这个加密的请求信息， 而将用户请求的数据保存在服务器端
    */
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const config = require('./config');

// 引入路由
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var publishRouter = require('./routes/publish');
var registerRouter = require('./routes/register');
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
        maxAge: 1000 * 60 * 60
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



app.use('/', indexRouter);
app.use('/publish', publishRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);


// 用户登录了就没有访问注册页面的权利
app.use('/register', registerRouter);


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