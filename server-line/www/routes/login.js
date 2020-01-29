var express = require("express");
var crypto = require("crypto");
User = require("../models/user.js");
var router = express.Router();
// 引入腾讯云短信sdk
var QcloudSms = require("qcloudsms_js");
// 短信应用 SDK AppID
var appid = 1400283544; // SDK AppID 以1400开头
// 短信应用 SDK AppKey
var appkey = "bc6f7e56046cf75b900636b2d3bd158c";
// 短信模板 ID，需要在短信控制台中申请
var templateId = 477456; //模板 ID 需要在短信控制台中申请
// 签名
var smsSign = "宁乡艾客访网络工作室"; // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请

var userMsg = {
    tel: '',
    code: ''
};

// 判断是否登录
router.get("/isLogin", function(req, res, next) {
    // console.log(req.session.user._id)

    if (req.session.user) {
        res.json({
            statusCode: '200',
            message: req.session.user
        })

    } else {
        res.json({
            statusCode: '100',
            message: '用户没有登录'
        })
    }
})

// 获取校验码
router.post("/getCode", function(req, res, next) {

    // 检查用户是否存在
    User.findOne({
        tel: req.body.tel
    }).then(user => {
        // 如果用户不存在
        if (!user) {
            res.json({
                statusCode: "100",
                message: "不存在此用户，请先注册"
            });
            return;
        }

        // 存在用户，发送校验码
        let tel = req.body.tel;

        // 需要发送短信的手机号码
        var phoneNumbers = [tel];

        // 实例化 QcloudSms
        var qcloudsms = QcloudSms(appid, appkey);

        // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
        function callback(err, res, resData) {
            if (err) {
                console.log("err: ", err);
            } else {
                // console.log("request data: ", res.req);
                // console.log("response data: ", resData);
                // 获取用户的手机号和验证码
                userMsg.tel = tel;
                userMsg.code = randomNum;
            }
        }

        //指定模板 ID 单发短信
        var ssender = qcloudsms.SmsSingleSender();

        // 生成一个四位数的随机数
        function randomNum(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        var randomNum = randomNum(1000, 9999);

        var params = [randomNum, 1];

        ssender.sendWithParam("86", phoneNumbers[0], templateId,
            params, smsSign, "", "", callback);

    });

    // next();
});

/* 登录 */
router.post("/", function(req, res, next) {
    // 生成密码的md5值
    // let md5 = crypto.createHash("md5");
    // password = md5.update(req.body.password).digest("hex");

    // 检查用户是否存在
    User.findOne({
        tel: req.body.tel
    }).then(user => {
        // 如果用户不存在
        if (!user) {
            res.json({
                statusCode: "100",
                message: "不存在此用户，请先注册"
            });
            return;
        }
        // 检查验证码密码是否一致
        console.log(userMsg.code, req.body.code)
        if (userMsg.code != req.body.code) {
            res.json({
                statusCode: "101",
                message: "验证码错误"
            });
            return;
        }

        // 用户名密码都匹配后， 将用户信息存入session
        req.session.user = user;
        res.json({
            statusCode: "200",
            message: "登录成功"
        });
    });

    // next();
});

module.exports = router;