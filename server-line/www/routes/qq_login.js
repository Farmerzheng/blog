var express = require("express");
var router = express.Router();
const request = require('request');
User = require('../models/user.js');

//多处调用，所以还是存个变量吧
var qqAppID = '101847766';
var qqAppkey = '0e4655d2f21916b18198de0d002ff9eb';
var qqRedirect_uri = 'http%3A%2F%2Fwww.91alex.com%2Fvideo';

var userTel = null;

router.get('/', function(req, res, next) {


    // 保存用户的手机号
    userTel = req.query.tel;

    var authorization = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + qqAppID + '&redirect_uri=' + qqRedirect_uri + '&state=233&scope=get_user_info,list_album,upload_pic';
    // console.log(authorization);

    // request(authorization, (err, response, bodys) => {
    // console.log(response.body)
    res.json({
        redirect_url: authorization
    });
    // })
});

router.get('/get_info', function(req, res, next) {
    //拿到code
    var code = req.query.code;
    //获取token
    var getTokenUrl = 'https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=' + qqAppID + '&client_secret=' + qqAppkey + '&code=' + code + '&redirect_uri=' + qqRedirect_uri;
    // res.send(getTokenUrl);
    request.get({ url: getTokenUrl }, function(err, httpResponse, body) {
        var str = body;
        // console.log('_____________-err____' + err);
        // console.log('_____________-str____' + str.split('='));
        // console.log('_____________httpResponse____' + JSON.stringify(httpResponse));
        // callback( {"error":100019,"error_description":"code to acce                                    ss token error"} );

        // access_token=69F77B3BB3E97ADB1725497A5493E918&expires_in=7776000&refresh_token=A1BD682E7EBA7ED9A788D1263CF1A209
        // str 出现错误的解决办法
        if (!str.split('=')[1]) return;

        var access_token = str.split('=')[1].split('&')[0];
        //获取用户openid
        var getMeUrl = 'https://graph.qq.com/oauth2.0/me?access_token=' + access_token;
        request.get({ url: getMeUrl }, function(err, httpResponse, body) {
            //QQ返回的是字符串，不是json，也不能直接转json，日了狗
            var str = body;
            var jsonStr = str.replace('callback( ', '');
            jsonStr = jsonStr.replace(' );', '');
            jsonStr = JSON.parse(jsonStr);
            var qqOpenid = jsonStr['openid'];

            console.log('qqOpenid' + qqOpenid);
            // var qqClient_id = jsonStr['client_id'];
            //拿到两个参数以后去获取用户资料
            request.get({ url: 'https://graph.qq.com/user/get_user_info?access_token=' + access_token + '&oauth_consumer_key=' + qqAppID + '&openid=' + qqOpenid }, function(err, httpResponse, body) {
                body = JSON.parse(body);
                console.log(body);

                // 检查QQ是否已经存在
                User.findOne({
                    qqOpenid: qqOpenid
                }).then((result) => {
                    if (result) {

                        console.log('qq user is exist');
                        // 用户存在,用户信息存入session
                        req.session.user = result;
                        res.json({
                            statusCode: "200",
                            message: '登录成功'
                        });
                        return;

                    } else {
                        //用户不存在，新增用户
                        console.log('qq user is not login');
                        let user = new User({
                            tel: '',
                            pictureList: [],
                            vip: '',
                            expirationTime: 0,
                            nickname: body.nickname,
                            gender: body.gender,
                            province: body.province,
                            city: body.city,
                            year: userTel,
                            constellation: body.constellation,
                            figureurl: body.figureurl_qq_2,
                            qqOpenid: qqOpenid,
                            browsedPictures: 0,
                            out_trade_no: ''
                        });

                        // 将user存储在users 集合中
                        user.save(function(err, doc) {
                            if (err) {
                                res.json({
                                    statusCode: "102",
                                    message: '注册失败'
                                })
                            } else {
                                // 用户信息存入session
                                req.session.user = user;
                                res.json({
                                    statusCode: "200",
                                    message: '登录成功'
                                })

                            }

                        });

                    }
                })

                // res.json({
                //     nickname: body.nickname,
                //     gender: body.gender,
                //     province: body.province,
                //     city: body.city,
                //     year: body.year,
                //     constellation: body.constellation,
                //     figureurl: body.figureurl_qq_1
                // });


                /**
                { ret: 0,
                msg: '',
                is_lost: 1,
                nickname: 'qzuser',
                gender: 'ç”·',
                gender_type: 2,
                province: 'å¹¿ä¸œ',
                city: 'æ·±åœ³',
                year: '1990',
                constellation: '',
                figureurl: 'http://qzapp.qlogo.cn/qzapp/101847766/B387ACD79DCE6EC8490FB3AFA2980206/30',
                figureurl_1: 'http://qzapp.qlogo.cn/qzapp/101847766/B387ACD79DCE6EC8490FB3AFA2980206/50',
                figureurl_2: 'http://qzapp.qlogo.cn/qzapp/101847766/B387ACD79DCE6EC8490FB3AFA2980206/100',
                figureurl_qq_1: 'http://thirdqq.qlogo.cn/qqapp/101847766/B387ACD79DCE6EC8490FB3AFA2980206/40',
                figureurl_qq_2: 'http://thirdqq.qlogo.cn/qqapp/101847766/B387ACD79DCE6EC8490FB3AFA2980206/100',
                figureurl_qq: 'http://thirdqq.qlogo.cn/qqapp/101847766/B387ACD79DCE6EC8490FB3AFA2980206/100',
                figureurl_type: '0',
                is_yellow_vip: '0',
                vip: '0',
                yellow_vip_level: '0',
                level: '0',
                is_yellow_year_vip: '0' }
                 */
                // res.send("\
                //     <h1>QQ昵称：" + body.nickname + "openid:" + qqOpenid + "</h1>\
                //     <p>![](" + body.figureurl_qq_1 + ")</p>\
                //     <p>性别：" + body.gender + "</p>\
                //     <p>地区：" + body.province + "," + body.city + "</p>\
                // ");
            })
        })
    })

});

module.exports = router;