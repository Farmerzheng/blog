var express = require("express");
var crypto = require("crypto");
User = require("../models/user.js");
var router = express.Router();

/* GET login page. */
router.post("/", function(req, res, next) {
    // 生成密码的md5值
    let md5 = crypto.createHash("md5");
    password = md5.update(req.body.password).digest("hex");

    // 检查用户是否存在
    User.findOne({
        name: req.body.name
    }).then(user => {
        // 如果用户不存在
        if (!user) {
            res.json({
                status: "100",
                message: "不存在此用户，请先注册"
            });
            return;
        }
        // 检查密码是否一致
        console.log(req.body.password, password);
        if (password != user.password) {
            res.json({
                status: "101",
                message: "密码错误"
            });
            return;
        }

        // 用户名密码都匹配后，将用户信息存入session
        req.session.user = user;
        res.json({
            status: "200",
            message: "登录成功"
        });
    });

    // next();
});

module.exports = router;