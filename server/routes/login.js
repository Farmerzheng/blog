var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {

    // res.render('index', {
    //     title: 'login'
    // });

    // // 如果请求中的 cookie 存在 isFirst
    // // 否则，设置 cookie 字段 isFirst, 并设置过期时间为10秒
    // if (req.cookies.isFirst) {
    //     res.send("再次欢迎访问");
    //     console.log(req.cookies)
    // } else {
    //     res.cookie('isFirst', 1, {
    //         maxAge: 10 * 1000
    //     });
    //     res.send("欢迎第一次访问");
    // }

});




module.exports = router;