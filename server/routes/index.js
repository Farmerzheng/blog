var express = require("express");
var User = require("../models/user.js");
var Article = require("../models/article");
var router = express.Router();

/* 首页*/

// 读取文章信息
router.get("/readArticle", function(req, res, next) {

    // 用户没有登录
    if (!req.session.user) {
        res.json({
            status: '100',
            message: '请先登录'
        })
    }
    // 用户已经登录
    Article.find({
        name: req.session.user.name
    }).then(article => {
        // 重新记录用户登录状态
        req.session.user = req.session.user;

        if (!article) {
            res.json({
                status: '101',
                message: '读取错误'
            })
        }
        res.json({
            status: '200',
            message: '读取成功',
            result: article
        })
    })

});

module.exports = router;