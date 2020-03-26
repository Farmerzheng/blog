var express = require("express");
var User = require("../models/user.js");
var Video = require("../models/video.js");
// 添加支持markdown发表文章的功能
// var Article = require("../models/article");
// var markdown = require('markdown').markdown;
var Picture = require('../models/picture');
// 引入操作表单的模块
var router = express.Router();
var http = require('http');


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

    // 每页显示的数据条数
    let perPage = Number(req.query.perPage);
    // 页数
    let page = req.query.page;
    // 用户已经登录


    Picture.find({
        // name: req.session.user.name
    }).sort({ _id: -1 }).skip((page - 1) * perPage).limit(perPage).exec(function(err, pictures) {
        // 重新记录用户登录状态
        // req.session.user = req.session.user;1122

        if (err) {
            res.json({
                statusCode: '101',
                message: '读取错误'
            })
        };
        res.json({
            statusCode: '200',
            message: '读取成功',
            result: pictures
        })
    })


});

// 读取图片详情页信息
router.get("/pictureDetail", function(req, res, next) {



    let picture = null;

    let id = req.query.id;

    console.log('id is ' + id);

    // 如果浏览的是视频
    if (id == 'video') {
        vip('视频');

    } else {
        // 根据图片id查询图片
        Picture.find({
            _id: req.query.id
        }).then(response => {
            vip(response);
        })
    }



    function vip(response) {

        picture = response;

        /*
            需要向百度推送的网站链接
            http://www.91alex.com/detail/index.html?id=5e36508e76f1412aada3e5e6
        */
        var content = "http://www.91alex.com/detail/index.html?id=" + id;
        // console.log('baidu engine url is ' + content);
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
        var baiduReq = http.request(options, function(res) {
            res.setEncoding("utf8");
            res.on("data", function(data) {
                console.log("baidu engine data:", data); //返回的数据
            });
        });

        baiduReq.write(content);
        baiduReq.end();

        console.log('user is ' + req.session.user);

        // 如果用户已经登录
        if (req.session.user) {

            if (req.session.user.tel) {
                // 电话号码登录
                let userTel = req.session.user.tel;

                console.log('user tel is ' + userTel);

                // 根据电话号码查找用户
                User.find({
                    tel: userTel
                }).then(user => {

                    // browsedPictures 自增 1 browsedPictures
                    // console.log('user is ' + user);
                    // console.log('user type is ' + typeof(user));
                    // console.log('user stringify is ' + JSON.stringify(user));
                    // console.log('user tel is ' + user[0].tel);
                    // console.log('user browsed pictures is ' + user[0].browsedPictures);

                    // 判断用户浏览的图片数量
                    if (user[0].browsedPictures > 0) {

                        /**
                           浏览数量大于5套，判断是否是VIP，是VIP 继续浏览，不是不能浏览
                           是VIP判断VIP类型
                           vip 0  可以再浏览5套
                           vip 1  浏览一个月
                           vip 2  浏览一年
                           vip 3  浏览100年
                         */

                        let vip = user[0].vip;
                        console.log('vip is' + vip);
                        if (vip == '') {
                            // 不是vip
                            res.json({
                                statusCode: '100',
                                message: '达到浏览量上线,不是VIP',
                                result: picture
                            })
                        } else {
                            // 是VIP
                            if (vip == 0) {
                                // 允许浏览1个视频，把browsedPictures变成0
                                // 将vip重置成空字符串

                                // 查询条件
                                var wherestr = {
                                    'tel': userTel
                                };


                                // 待更新数据
                                var updatestr = {
                                    vip: '',
                                    browsedPictures: -10
                                };

                                User.updateOne(wherestr, updatestr, function(err, response) {
                                    console.log('update user vip to zero')
                                    res.json({
                                        statusCode: '200',
                                        message: '您是vip=0会员',
                                        result: picture
                                    })

                                });


                            } else {
                                // 根据时间判断用户是否有浏览权限
                                //  vip截止时间
                                let expirationTime = user[0].expirationTime;

                                // 当前时间戳
                                let nowTime = Date.now();
                                // console.log(Number(expirationTime) - Number(nowTime));

                                if (Number(expirationTime) - Number(nowTime) > 0) {
                                    console.log('vip is not expire');
                                    // 用户的VIP权限没有到期
                                    res.json({
                                        statusCode: '200',
                                        message: 'VIP用户',
                                        result: picture
                                    })
                                } else {
                                    console.log('vip is expire');
                                    //用户的VIP权限到期
                                    res.json({
                                        statusCode: '100',
                                        message: '您的VIP权限到期',
                                        result: picture
                                    })
                                }
                            }
                        }

                    } else {
                        if (id != 'video') {
                            // 如果浏览的不是视频不进行加权，直接返回
                            return;
                        }
                        // 查询条件
                        var wherestr = {
                            'tel': userTel
                        };
                        // 待更新数据
                        var updatestr = {
                            browsedPictures: user[0].browsedPictures + 1
                        };
                        User.updateOne(wherestr, updatestr, function(err, response) {
                            res.json({
                                statusCode: '200',
                                message: '未达到浏览量上线',
                                result: picture
                            });
                        });

                    }

                })
            } else {
                // QQ登录
                // console.log(req.session.user.qqOpenid);
                User.findOne({
                    qqOpenid: req.session.user.qqOpenid
                }).then(user => {


                    // console.log('user is ' + user);
                    // 判断用户浏览的图片数量
                    if (user.browsedPictures > 0) {

                        /**
                           浏览数量大于5套，判断是否是VIP，是VIP 继续浏览，不是不能浏览
                           是VIP判断VIP类型
                           vip 0  可以再浏览5套
                           vip 1  浏览一个月
                           vip 2  浏览一年
                           vip 3  浏览100年
                         */

                        let vip = user.vip;
                        if (vip == '') {
                            // 不是vip
                            res.json({
                                statusCode: '100',
                                message: '达到浏览量上线,不是VIP',
                                result: picture
                            })
                        } else {
                            // 是VIP
                            if (vip == 0) {
                                // 允许浏览5张图片，把browsedPictures变成0
                                // 将vip重置成空字符串

                                // 查询条件
                                var wherestr = {
                                    'qqOpenid': user.qqOpenid
                                };


                                // 待更新数据
                                var updatestr = {
                                    vip: '',
                                    browsedPictures: -10
                                };
                                User.updateOne(wherestr, updatestr, function(err, response) {
                                    res.json({
                                        statusCode: '200',
                                        message: '您是vip=0会员',
                                        result: picture
                                    })

                                });
                            } else {
                                // 根据时间判断用户是否有浏览权限
                                //  vip截止时间
                                let expirationTime = user.expirationTime;
                                // 当前时间戳
                                let nowTime = Date.now();
                                if (Number(expirationTime) - Number(nowTime) > 0) {
                                    console.log('vip is not expire');
                                    // 用户的VIP权限没有到期
                                    res.json({
                                        statusCode: '200',
                                        message: 'VIP用户',
                                        result: picture
                                    })
                                } else {
                                    console.log('vip is expire');
                                    //用户的VIP权限到期
                                    res.json({
                                        statusCode: '100',
                                        message: '您的VIP权限到期',
                                        result: picture
                                    })
                                }
                            }
                        }

                    } else {
                        if (id != 'video') {
                            // 如果浏览的不是视频不进行加权，直接返回
                            return;
                        }
                        // 查询条件
                        var wherestr = {
                            'qqOpenid': user.qqOpenid
                        };
                        // 待更新数据
                        var updatestr = {
                            browsedPictures: user.browsedPictures + 1
                        };
                        User.updateOne(wherestr, updatestr, function(err, response) {
                            res.json({
                                statusCode: '200',
                                message: '未达到浏览量上线',
                                result: picture
                            });
                        });
                    }

                })
            }
        } else {
            res.json({
                statusCode: '101',
                message: '您还未登录',
                result: picture
            })
        }
    }

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
    // var totalNum = 0;
    if (type == '0') {
        Picture.find({}).then(response => {
            // console.log('totalNum' + res.length)
            totalNum = response.length;
            // 如果是最新图片
            Picture.find({}).sort({ time: -1 }).skip((page - 1) * perPage).limit(perPage).exec(function(err, pictures) {
                if (err) {
                    res.json({
                        statusCode: '101',
                        message: '读取错误'
                    })
                    return;
                };
                console.log('totalNum' + totalNum)
                res.json({
                    statusCode: '200',
                    message: '读取成功',
                    result: pictures,
                    totalNum: totalNum
                })
            })
        })
    } else {
        Picture.find({
            type: type
        }).then(response => {
            // console.log('totalNum' + res.length)
            totalNum = response.length;
            // 如果是分类图片
            Picture.find({
                type: type
            }).sort({ time: -1 }).skip((page - 1) * perPage).limit(perPage).exec(function(err, pictures) {
                if (err) {
                    res.json({
                        statusCode: '101',
                        message: '读取错误'
                    });
                    return;
                };
                console.log('totalNum' + totalNum)
                res.json({
                    statusCode: '200',
                    message: '读取成功',
                    result: pictures,
                    totalNum: totalNum
                })
            })
        })
    }

});

// 读取注册用户信息信息
router.get("/users", function(req, res, next) {
    // 每页显示的数据条数
    let perPage = Number(req.query.perPage);
    // 页数
    let page = req.query.page;
    // 用户已经登录
    User.find({
        // name: req.session.user.name
    }).sort({ _id: -1 }).skip((page - 1) * perPage).limit(perPage).exec(function(err, users) {
        // 重新记录用户登录状态
        // req.session.user = req.session.user;1122

        if (err) {
            res.json({
                statusCode: '101',
                message: '读取错误'
            })
        };
        res.json({
            statusCode: '200',
            message: '读取成功',
            result: users
        })
    })
});

// 读取视频列表信息
router.get("/videos", function(req, res, next) {
    // 每页显示的数据条数
    let perPage = Number(req.query.perPage);
    // 页数
    let page = req.query.page;

    Video.find({}).then(response => {
        let totalNum = response.length;

        // 用户已经登录
        Video.find({
            // name: req.session.user.name
        }).sort({ _id: -1 }).skip((page - 1) * perPage).limit(perPage).exec(function(err, videos) {
            if (err) {
                res.json({
                    statusCode: '101',
                    message: '读取错误'
                })
            };
            res.json({
                statusCode: '200',
                message: '读取成功',
                result: videos,
                totalNum: totalNum
            })
        })

    })
});

module.exports = router;