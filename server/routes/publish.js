var express = require('express');
var Article = require('../models/article');
var router = express.Router();


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
            status: "0",
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
                status: "100",
                message: '发表失败'
            })
        } else {
            res.json({
                status: "200",
                message: '发表成功'
            })
        }
    })

    // next();
});

module.exports = router;