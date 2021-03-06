var express = require('express');
var Article = require('../models/article');
var router = express.Router();


// 页面访问权限控制，未登录不允许发表文章
router.get('/', function(req, res, next) {


    // 检测用户是否登录   
    if (!req.session.user) {
        // 用户没有登录，返回至首页
        res.redirect('/');
    } else {
        // next函数主要是用来确保所有注册的中间件被一个接一个的执行， 那么我们就应该在所有的中间件中调用next函数， 但有一个特例， 如果我们定义的中间件终结了本次请求， 那就不应该再调用next函数， 否则就可能会出问题

        next() //移交给 app.use(express.static(path.join(__dirname, 'public')));处理
    }
})

/* 发表文章页 */
router.post('/', function(req, res, next) {

    console.log(1);

    let date = new Date();
    // console.log(date)

    let title = req.body.title;
    let art = req.body.article;

    function getCurrentDate(format) {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        var day = now.getDay(); //得到周几
        var hour = now.getHours(); //得到小时
        var minu = now.getMinutes(); //得到分钟
        var sec = now.getSeconds(); //得到秒
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        var time = "";
        //精确到天
        if (format == 1) {
            time = year + "-" + month + "-" + date;
        }
        //精确到分
        else if (format == 2) {
            time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
        }
        return time;
    }
    let time = getCurrentDate(2);

    // 判断用户是否登录
    if (req.session.user) {
        var name = req.session.user.name;
    } else {
        return res.json({
            statusCode: "0",
            message: '请先登录'
        })
    }

    console.log(req, req.body, title, art, name, time);
    let article = new Article({
        'name': name,
        'time': time,
        'title': title,
        'article': art
    });

    console.log(article)
        // 存储到articles 集合中
    article.save((err, doc) => {
        if (err) {
            res.json({
                statusCode: "100",
                message: '发表失败'
            })
        } else {
            res.json({
                statusCode: "200",
                message: '发表成功'
            })
        }
    })

    // next();
});

module.exports = router;