var express = require("express");
var User = require("../models/user.js");
// 添加支持markdown发表文章的功能
// var Article = require("../models/article");
// var markdown = require('markdown').markdown;
var Picture = require('../models/picture');
// 引入操作表单的模块
var router = express.Router();


/* 首页*/

// 读取文章信息
/*
router.get("/readArticle", function(req, res, next) {

    // 用户没有登录
    if (!req.session.user) {
        return res.json({
            status: '100',
            message: '请先登录'
        })
    }
    // 用户已经登录
    Article.find({
        name: req.session.user.name
    }).then(articles => {
        // 重新记录用户登录状态
        req.session.user = req.session.user;

        if (!articles) {
            res.json({
                status: '101',
                message: '读取错误'
            })
        };
        // 使用 markdown 发表文章
        articles.forEach(function(doc) {
            doc.article = markdown.toHTML(doc.article)
        });
        // console.log(articles)
        res.json({
            status: '200',
            message: '读取成功',
            result: articles
        })
    })

});
*/
// 读取图片信息
router.get("/pictureList", function(req, res, next) {

    // 用户没有登录
    // if (!req.session.user) {
    //     return res.json({
    //         status: '100',
    //         message: '请先登录'
    //     })
    // }
    // 用户已经登录
    Picture.find({
        // name: req.session.user.name
    }).then(pictures => {
        // 重新记录用户登录状态
        // req.session.user = req.session.user;

        if (!pictures) {
            res.json({
                status: '101',
                message: '读取错误'
            })
        };
        // 使用 markdown 发表文章
        // articles.forEach(function(doc) {
        //     doc.article = markdown.toHTML(doc.article)
        // });
        // console.log(articles)
        res.json({
            status: '200',
            message: '读取成功',
            result: pictures
        })
    })

});
module.exports = router;