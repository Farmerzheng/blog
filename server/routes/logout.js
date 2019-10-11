var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res, next) {
    // 丢掉session中用户的信息，实现用户退出
    req.session.user = null;
    res.json({
        status: "200",
        message: '登出成功'
    })
});

module.exports = router;