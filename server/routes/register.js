var express = require('express');
var router = express.Router();
var crypto = require('crypto');
User = require('../models/user.js');

// 页面权限控制
// router.get('/', function(req, res, next) {
//     // ，检测用户是否登录
//     console.log(req.session.user)
//     if (req.session.user) {
//         //         // 用户已经登录,返回之前的页面
//         res.redirect('/');
//     } else {
//         // next函数主要是用来确保所有注册的中间件被一个接一个的执行， 那么我们就应该在所有的中间件中调用next函数， 但有一个特例， 如果我们定义的中间件终结了本次请求， 那就不应该再调用next函数， 否则就可能会出问题

//         next() //移交给 app.use(express.static(path.join(__dirname, 'public')));处理
//     }

// })

/* 注册页 */
router.post('/', function(req, res, next) {
    // req.body  POST请求信息解析过后的对象
    // console.log(req.body, req)



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