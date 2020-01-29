var express = require("express");
var crypto = require("crypto");
User = require("../models/user.js");
Picture = require("../models/picture");
var router = express.Router();
var userMsg = {
    tel: '',
    code: ''
};

/* 收藏图片 */
router.post("/", function(req, res, next) {

    // 检查用户是否登录
    if (!req.session.user) {
        res.json({
            statusCode: "100",
            message: "请先登录"
        });
    }

    if (req.session.user.tel) {
        // 如果有手机号，按手机号查找
        // 检查用户是否存在
        User.findOne({
            tel: req.session.user.tel
        }).then(user => {

            // 判断pictureList 列表有没有此图片
            for (let i = 0; i < user.pictureList.length; i++) {
                if (user.pictureList[i]._id == req.body.id) {
                    res.json({
                        statusCode: '101',
                        message: '您已经收藏过了'
                    });
                    return;
                }
            }

            // 向用户的pictureList列表插入数据
            Picture.findOne({
                _id: req.body.id
            }).then(doc => {
                if (doc) {
                    user.pictureList.push(doc);
                    user.save(function(err, doc) {
                        if (err) {
                            res.json({
                                statusCode: "102",
                                error: '收藏失败'
                            })
                        } else {
                            res.json({
                                statusCode: "200",
                                error: '收藏成功'
                            })
                        }
                    })
                }
            })
        });
    } else {
        // 否则按照qqOpenid查找
        User.findOne({
            qqOpenid: req.session.user.qqOpenid
        }).then(user => {

            // 判断pictureList 列表有没有此图片
            for (let i = 0; i < user.pictureList.length; i++) {
                if (user.pictureList[i]._id == req.body.id) {
                    res.json({
                        statusCode: '101',
                        message: '您已经收藏过了'
                    });
                    return;
                }
            }

            // 向用户的pictureList列表插入数据
            Picture.findOne({
                _id: req.body.id
            }).then(doc => {
                if (doc) {
                    user.pictureList.push(doc);
                    user.save(function(err, doc) {
                        if (err) {
                            res.json({
                                statusCode: "102",
                                error: '收藏失败'
                            })
                        } else {
                            res.json({
                                statusCode: "200",
                                error: '收藏成功'
                            })
                        }
                    })
                }
            })
        });
    }



    // next();
});

// 获取用户收藏列表
router.get('/pictureList', function(req, res, next) {

    // 检查用户是否登录
    if (!req.session.user) {
        res.json({
            statusCode: "100",
            message: "请先登录"
        });
    }

    if (req.session.user.tel) {
        // 如果有手机号，按手机号查找
        User.findOne({
            tel: req.session.user.tel
        }).then(user => {

            console.log('tel' + user);
            res.json({
                statusCode: '200',
                message: '获取成功',
                result: user.pictureList,
                user: req.session.user
            })
        })
    } else {
        // 否则按照qqOpenid查找
        User.findOne({
            qqOpenid: req.session.user.qqOpenid
        }).then(user => {

            console.log('openid' + user);
            res.json({
                statusCode: '200',
                message: '获取成功',
                result: user.pictureList,
                user: req.session.user
            })
        })
    }


})

module.exports = router;