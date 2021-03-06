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
// 读取图片总数
router.get("/pictureNum", function(req, res, next) {
    Picture.find({}).then(doc => {
        res.json({
            statusCode: '200',
            message: '读取成功',
            result: doc.length
        })
    })
})




// 读取首页图片信息
router.get("/pictureList", function(req, res, next) {

    // 用户没有登录
    // if (!req.session.user) {
    //     return res.json({
    //         status: '100',
    //         message: '请先登录'
    //     })
    // }

    // 每页显示的数据条数
    let perPage = Number(req.query.perPage);
    // 页数
    let page = req.query.page;
    // 用户已经登录


    Picture.find({
        // name: req.session.user.name
    }).skip((page - 1) * perPage).limit(perPage).exec(function(err, pictures) {
        // 重新记录用户登录状态
        // req.session.user = req.session.user;

        if (err) {
            res.json({
                statusCode: '101',
                message: '读取错误'
            })
        };
        // 使用 markdown 发表文章
        // articles.forEach(function(doc) {
        //     doc.article = markdown.toHTML(doc.article)
        // });
        // console.log(articles)
        res.json({
            statusCode: '200',
            message: '读取成功',
            result: pictures
        })
    })


});

// 读取图片详情页信息
router.get("/pictureDetail", function(req, res, next) {

    console.log(req.query.id)
        // 用户已经登录
    Picture.find({
        _id: req.query.id
    }).then(picture => {
        if (!picture) {
            res.json({
                statusCode: '101',
                message: '读取错误'
            })
        };

        res.json({
            statusCode: '200',
            message: '读取成功',
            result: picture
        })
    })

});

// 读取图片分类信息
router.get("/pictureType", function(req, res, next) {

    // 重新记录用户登录状态
    // req.session.user = req.session.user;

    // 每页显示的数据条数
    let perPage = Number(req.query.perPage);
    // 页数
    let page = req.query.page;
    // 类型
    let queryType = req.query.type;


    let type = '';
    switch (queryType) {
        case "new":
            type = "0";
            break;
        case "baotunqun":
            type = "1";
            break;
        case "chaoduanku":
            type = "2";
            break;
        case "niuzaiku":
            type = "3";
            break;
        case "mote":
            type = "4";
            break;
        case "meixiong":
            type = "5";
            break;
        case "meitui":
            type = "6";
            break;
        case "zipai":
            type = "7";
            break;
        case "ChinaJoy":
            type = "8";
    }

    // 获取对应分类图片的总数
    let totalNum = 0;
    if (type == '0') {
        Picture.find({}).then(res => {
            totalNum = res.length;
        })
    } else {
        Picture.find({
            type: type
        }).then(res => {
            totalNum = res.length;
        })
    }
    //获取图片信息
    if (type == '0') {
        // 如果是最新图片
        Picture.find({}).skip((page - 1) * perPage).limit(perPage).exec(function(err, pictures) {
            if (err) {
                res.json({
                    statusCode: '101',
                    message: '读取错误'
                })
                return;
            };
            res.json({
                statusCode: '200',
                message: '读取成功',
                result: pictures,
                totalNum: totalNum
            })
        })

    } else {
        // 如果是分类图片
        Picture.find({
            type: type
        }).skip((page - 1) * perPage).limit(perPage).exec(function(err, pictures) {
            if (err) {
                res.json({
                    statusCode: '101',
                    message: '读取错误'
                });
                return;
            };
            res.json({
                statusCode: '200',
                message: '读取成功',
                result: pictures,
                totalNum: totalNum
            })
        })
    }
});

module.exports = router;