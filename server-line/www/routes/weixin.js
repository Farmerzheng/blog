var express = require('express');
var router = express.Router();
const request = require('request');
const sha1 = require('sha1');

/* GET home page. */
router.post('/', function(req, res, next) {

    let resTo = res;
    const grant_type = 'client_credential'
    const secret = '4c7484901171665ffdc6f37fa4bef7f7';
    const appid = 'wx470416dc40550534';

    request('https://api.weixin.qq.com/cgi-bin/token?grant_type=' + grant_type + '&appid=' + appid + '&secret=' + secret, (err, res, body) => {

        // access_token是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用access_token。开发者需要进行妥善保存。access_token的存储至少要保留512个字符空间。access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。
        let access_token = JSON.parse(body).access_token;

        console.log(JSON.parse(body));

        request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (err, res, body) => {

            let jsapi_ticket = JSON.parse(body).ticket
            let num = Math.random()
            let noncestr = num.toString(32).substr(3, 20); // 随机字符串
            let timestamp = Math.floor(Date.now() / 1000); //精确到秒

            // console.log(jsapi_ticket)

            //console.log({jsapi_ticket:JSON.parse(body).ticket,noncestr:noncestr,timestamp:timestamp,url:'http://www.91alex.com/Weixin-demo/demo.html'  });

            // 使用接口的url链接，不包含#后的内容
            let url = req.body.url;

            // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
            let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url

            // 用sha1加密
            let signature = sha1(str)

            //console.log(noncestr,timestamp,jsapi_ticket,url,signature)

            resTo.json({
                appId: appid,
                timestamp: timestamp,
                nonceStr: noncestr,
                signature: signature,
            })

        })


    })


});

module.exports = router;