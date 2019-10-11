var express = require('express');
var router = express.Router();
var crypto = require('crypto');
User = require('../models/user.js');

/* GET reg page. */
router.post('/', function(req, res, next) {
    // req.body  POST请求信息解析过后的对象
    console.log(req.body, req)
    let name = req.body.name,
        password = req.body.password,
        password_repeat = req.body.password_repeat,
        email = req.body.email;
    // 检验用户输入的两次密码是否一致
    if (password != password_repeat) {
        res.json({
            status: "100",
            message: '两次输入密码不一致'
        });
        return;
    }
    // 对密码进行加密
    let md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');

    // 检查用户名是否已经存在
    User.findOne({
        name: name
    }).then((result) => {
        if (result) {
            // 用户存在
            res.json({
                status: "101",
                message: '已经存在此用户名'
            });
            return;

        } else {
            //用户不存在，新增用户
            let user = new User({
                "name": name,
                "password": password,
                "email": email
            });

            // 将user存储在users 集合中
            user.save(function(err, doc) {
                if (err) {
                    res.json({
                        status: "102",
                        message: '插入用户失败'
                    })
                } else {

                    // 用户信息存入session
                    req.session.user = user;
                    res.json({
                        status: "200",
                        message: '插入用户成功'
                    })

                }

            });

        }
    })
});

module.exports = router;