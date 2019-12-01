var express = require('express');
var router = express.Router();
var crypto = require('crypto');
User = require('../models/user.js');

// 引入腾讯云短信sdk
var QcloudSms = require("qcloudsms_js");
// 短信应用 SDK AppID
var appid = 1400283544; // SDK AppID 以1400开头
// 短信应用 SDK AppKey
var appkey = "bc6f7e56046cf75b900636b2d3bd158c";
// 短信模板 ID，需要在短信控制台中申请
var templateId = 477456; // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
// 签名
var smsSign = "宁乡艾客访网络工作室"; // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请

var user = {
    tel: '',
    code: ''
};


// 页面权限控制
router.get('/', function(req, res, next) {
    // ，检测用户是否登录
    console.log(req.session.user)
    if (req.session.user) {
        //         // 用户已经登录,返回之前的页面
        res.redirect('/');
    } else {
        // next函数主要是用来确保所有注册的中间件被一个接一个的执行， 那么我们就应该在所有的中间件中调用next函数， 但有一个特例， 如果我们定义的中间件终结了本次请求， 那就不应该再调用next函数， 否则就可能会出问题

        next() //移交给 app.use(express.static(path.join(__dirname, 'public')));处理
    }

})

/* 注册页 */
// router.post('/', function(req, res, next) {
//     // req.body  POST请求信息解析过后的对象
//     // console.log(req.body, req)

//     let name = req.body.name,
//         password = req.body.password,
//         password_repeat = req.body.password_repeat,
//         email = req.body.email;
//     // 检验用户输入的两次密码是否一致
//     if (password != password_repeat) {
//         res.json({
//             status: "100",
//             message: '两次输入密码不一致'
//         });
//         return;
//     }
//     // 对密码进行加密
//     let md5 = crypto.createHash('md5');
//     password = md5.update(password).digest('hex');

//     // 检查用户名是否已经存在
//     User.findOne({
//         name: name
//     }).then((result) => {
//         if (result) {
//             // 用户存在
//             res.json({
//                 status: "101",
//                 message: '已经存在此用户名'
//             });
//             return;

//         } else {
//             //用户不存在，新增用户
//             let user = new User({
//                 "name": name,
//                 "password": password,
//                 "email": email
//             });

//             // 将user存储在users 集合中
//             user.save(function(err, doc) {
//                 if (err) {
//                     res.json({
//                         status: "102",
//                         message: '插入用户失败'
//                     })
//                 } else {

//                     // 用户信息存入session
//                     req.session.user = user;
//                     res.json({
//                         status: "200",
//                         message: '插入用户成功'
//                     })

//                 }

//             });

//         }
//     })
// });


// 获取验证码
router.post('/getCode', function(req, res, next) {
    // req.body  POST请求信息解析过后的对象
    // console.log(req.body, req)

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
            console.log("request data: ", res.req);
            console.log("response data: ", resData);
            // 获取用户的手机号和验证码
            user.tel = tel;
            user.code = randomNum;
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

// 注册
router.post('/', function(req, res, next) {
    // req.body  POST请求信息解析过后的对象
    // console.log(req.body, req)

    let tel = req.body.tel,
        code = req.body.code;



    // 检验手机号、验证码是否一致
    if (user.tel != tel || user.code != code) {
        res.json({
            status: "100",
            message: '验证码输入错误'
        });
        return;
    }

    // 检查手机号是否已经存在
    User.findOne({
        tel: tel
    }).then((result) => {
        if (result) {
            // 用户存在
            res.json({
                status: "101",
                message: '此手机号已经注册'
            });
            return;

        } else {
            //用户不存在，新增用户
            let user = new User({
                "tel": tel
            });

            // 将user存储在users 集合中
            user.save(function(err, doc) {
                if (err) {
                    res.json({
                        status: "102",
                        message: '注册失败'
                    })
                } else {
                    // 用户信息存入session
                    req.session.user = user;
                    res.json({
                        status: "200",
                        message: '注册成功'
                    })

                }

            });

        }
    })
});
module.exports = router;