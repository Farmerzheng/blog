var createError = require('http-errors');
var express = require('express');
var path = require('path');
// session数据存储空间一般是在内存中开辟的，那么在内存中的session显然是存在极大的数据丢失的隐患的，比如系统掉电，所有的会话数据就会丢失，如果是证券交易所那么这种后果的严重性可想而知。所以为了解决这个问题可以将session持久化保存，比如保存到数据库。那么这篇博客就是介绍session持久化保存到mongoDB的工具connect-mongo
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');

/*
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
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var postRouter = require('./routes/post');
var registerRouter = require('./routes/register');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
// cookie  解析的中间件
app.use(cookieParser());
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

    */
// express.session() 提供会话支持
// secret 用来防止篡改cookie
// key cookie的名字
// maxAge: cookie的生存期
// store 把会话信息存储在数据库中，以免丢失
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db, //cookie name
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
    // store: new MongoStore({
    // db: settings.db
    // })
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/post', postRouter);
app.use('/register', registerRouter);

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
    res.render('error');
});

module.exports = app;