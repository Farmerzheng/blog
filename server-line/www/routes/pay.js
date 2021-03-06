var express = require("express");
var User = require("../models/user.js");
var Picture = require('../models/picture');
const request = require('request');
const payConfig = require('../payConfig');
const payUtil = require('../payUtil');
var xmlreader = require("xmlreader");
var router = express.Router();
const xml2js = require('xml2js');
var xmlparser = require('express-xml-bodyparser');

User = require("../models/user.js");




// 吊起微信支付
router.get("/", function(req, res, next) {

    // let code = req.query.code;
    // console.log('code is ' + code);

    // request('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + payConfig.wxAppId + '&secret=' + payConfig.wxAppSecret + '&code=' + code + '&grant_type=authorization_code', (err, response, bodys) => {

    // console.log(response.body);
    // let data = JSON.parse(response.body);

    // let access_token = data.access_token;

    // let openid = data.openid;

    // console.log('openid is ' + data);

    console.log(req.query);


    let appid = payConfig.wxAppId;
    let mchid = payConfig.wxMchId;
    let nonce_str = payUtil.createNonceStr(); //随机字符串，不长于32位
    let body = '成为VIP会员'; //商品简单描述
    let out_trade_no = Date.now(); //以时间戳作为商户订单号


    // 查询条件
    if (req.query.qqOpenid) {
        // console.log('qqOpenid is ' + req.query.qqOpenid)
        var wherestr = {
            'qqOpenid': req.query.qqOpenid
        };
    } else {
        // console.log('tel is ' + req.query.tel)
        var wherestr = {
            'tel': req.query.tel
        };
    }



    // 待更新数据
    var updatestr = {
        out_trade_no: out_trade_no
    };

    User.updateOne(wherestr, updatestr, function(err, response) {

    });



    let total_fee = payUtil.getmoney(req.query.money); //总金额,单位为分
    let spbill_create_ip = req.ip; //必须传正确的用户端IP,支持ipv4、ipv6格式
    let notify_url = payConfig.payUrl; //接收微信支付异步通知回调地址，通知url必须为直接可访问的url，不能携带参数
    let trade_type = 'MWEB'; //交易类型，H5支付的交易类型为MWEB
    let scene_info = JSON.stringify({
        "h5_info": {
            "type": "Wap",
            "wap_url": "http://www.91alex.com",
            "wap_name": "艾客访充值"
        }
    });
    let mchkey = payConfig.wxPayKey;
    // console.log(out_trade_no)
    let params = {
        appid: appid,
        mch_id: mchid,
        nonce_str: nonce_str,
        body: body,
        notify_url: notify_url,
        out_trade_no: out_trade_no,
        spbill_create_ip: spbill_create_ip,
        total_fee: total_fee,
        trade_type: trade_type,
        scene_info: scene_info
    };

    let sign = payUtil.paysignjsapi(params, mchkey);

    // console.log('sign==', sign);
    //组装xml数据
    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>"; //appid
    formData += "<body><![CDATA[" + "成为VIP会员" + "]]></body>";
    formData += "<mch_id>" + mchid + "</mch_id>"; //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
    formData += "<notify_url>" + notify_url + "</notify_url>";
    formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
    formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
    formData += "<total_fee>" + total_fee + "</total_fee>";
    formData += "<trade_type>" + trade_type + "</trade_type>";
    formData += "<scene_info>" + scene_info + "</scene_info>";
    formData += "<sign>" + sign + "</sign>";
    formData += "</xml>";

    // var url = 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder';
    var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

    request({
            url: url,
            method: 'POST',
            body: formData
        }, function(err, response, body) {
            // res.json({
            //     response: response
            // })
            if (response.statusCode == 200) {
                /* response.body 的内容如下：
                 "<xml>
                 <return_code><![CDATA[SUCCESS]]></return_code>
                 <return_msg><![CDATA[OK]]></return_msg>
                 <appid><![CDATA[wx470416dc40550534]]></appid> 
                 <mch_id><![CDATA[1565631271]]></mch_id> 
                 <nonce_str><![CDATA[7NFAlq3X73iGQYzk]]></nonce_str> 
                 <sign><![CDATA[1E5B680E406B65CAF96DBEF93575D228]]></sign> 
                 <result_code><![CDATA[SUCCESS]]></result_code> 
                 <prepay_id><![CDATA[wx21201731383117c307ed15f71634598700]]></prepay_id> <trade_type><![CDATA[MWEB]]></trade_type> 
                 <mweb_url><![CDATA[https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx21201731383117c307ed15f71634598700&package=3002775383]]>
                 </mweb_url> </xml>"
                 */

                xml2js.parseString(response.body, function(error, result) {

                    if (result.xml.return_code == 'SUCCESS') {
                        // var prepay_id = result.xml.prepay_id[0];

                        //将预支付订单和其他信息一起签名后返回给前端
                        // let timestamp = payUtil.createTimeStamp();
                        // let finalsign = payUtil.paysignjsapifinal(appid, mchid, prepay_id, nonce_str, timestamp, mchkey);
                        // console.log('解析后的finalsign==', finalsign);

                        // 将即将跳转的页面返回给前端
                        res.json({
                            // 'appId': appid,
                            // 'partnerId': mchid,
                            // 'prepayId': prepay_id,
                            // 'nonceStr': nonce_str,
                            // 'timeStamp': timestamp,
                            // 'package': 'Sign=WXPay',
                            // 'sign': finalsign,
                            'mweb_url': result.xml.mweb_url[0] + '&redirect_url=http%3a%2f%2fwww.91alex.com%2fcheap?order=' + out_trade_no

                        });
                        //拼接回调地址
                        // 用户在微信中间页面操作后(支付或取消支付) 会回跳到我们指定的回调地址， 并带上我们拼装的参数。 根据URL中的参数， 前端页面请求后端接口查询支付结果(服务器根据支付订单id向微信发起查询)， 然后展示给用户。（ 根据微信文档， 由于设置redirecturl后, 回跳指定页面的操作可能发生在： 1, 微信支付中间页调起微信收银台后超过5秒 2, 用户点击“ 取消支付“ 或支付完成后点“ 完成” 按钮。 因此无法保证页面回跳时， 支付流程已结束， 所以商户设置的redirecturl地址不能自动执行查单操作， 应让用户去点击按钮触发查单操作。详细请看：https://cloud.tencent.com/developer/article/1467638
                        //返回mweb_url,
                        // 'ip': spbill_create_ip
                    }

                })

            }

        })
        // })
})

// 支付结果通知/退款结果通知
router.post('/notify', xmlparser({
    trim: false,
    explicitArray: false
}), function(req, response, next) {

    let data = req.body.xml;
    let out_trade_no = data.out_trade_no;
    // let openid = data.openid;
    // console.log(data)
    /**
     * data 
     *{
         appid: 'wx470416dc40550534',
         bank_type: 'PAB_CREDIT',
         cash_fee: '100',
         fee_type: 'CNY',
         is_subscribe: 'N',
         mch_id: '1565631271',
         nonce_str: '3p3ezbhs9ybarjp',
         openid: 'oVYYEwaFMm6YFTX_CVrl_rThg9p0',
         out_trade_no: '18515471826a1577014413336',
         result_code: 'SUCCESS',
         return_code: 'SUCCESS',
         sign: 'BA0F06FA434ADE62279B4970E40966A5',
         time_end: '20191222193345',
         total_fee: '100',
         trade_type: 'MWEB',
         transaction_id: '4200000462201912226580759530'
     }

     */

    // 获取用户手机号
    // let userTel = data.out_trade_no.split('a')[0];

    // 获取用户订单金额
    let total_fee = data.total_fee;

    // console.log(data, userTel);

    // 根据订单金额判断vip类型
    let vipType = null;

    // 当前时间戳
    let nowTime = Date.now();

    // 到期时间戳
    let expirationTime = 0;

    // seconds 秒后到期
    let seconds = 0;

    switch (total_fee) {
        case '100':
            vipType = '0';
            // 一天后的时间戳
            seconds = 1000 * 60 * 60 * 24; //86381671
            break;
        case '1900':
            vipType = '1';
            // 一月后的时间戳
            seconds = 1000 * 60 * 60 * 24 * 30;
            break;
        case '9900':
            vipType = '2';
            // 一年后的时间戳
            seconds = 1000 * 60 * 60 * 24 * 30 * 12;
            break;
        case '19900':
            vipType = '3';
            // 100年后的时间戳
            seconds = 1000 * 60 * 60 * 24 * 30 * 12 * 100;
    }

    expirationTime = Number(nowTime) + Number(seconds);
    console.log(Number(nowTime), expirationTime)

    // 更新数据库中用户的vip类型
    // 查询条件
    var wherestr = {
        out_trade_no: out_trade_no
    };


    // 待更新数据
    var updatestr = {
        'vip': vipType,
        'expirationTime': expirationTime
    };

    User.updateOne(wherestr, updatestr, function(err, res) {});

    // json转xml函数
    var jsonToXml = function(json) {
        let _xml = '';
        Object.keys(json).map((key) => {
            _xml += `<${key}>${json[key]}</${key}>`
        })
        return `<xml>${_xml}</xml>`;
    }

    if (data.result_code == 'SUCCESS') {
        // 支付成功
        var sendData = {
            return_code: 'SUCCESS',
            return_msg: 'OK'
        }
        response.end(jsonToXml(sendData));
    }

});

// 查询订单
router.post('/orderquery', function(req, res, next) {

    let out_trade_no = req.body.out_trade_no;

    // console.log()
    let appid = payConfig.wxAppId;
    let mchid = payConfig.wxMchId;
    let nonce_str = payUtil.createNonceStr(); //随机字符串，不长于32位

    let mchkey = payConfig.wxPayKey;
    let params = {
        appid: appid,
        mch_id: mchid,
        nonce_str: nonce_str,
        out_trade_no: out_trade_no
    };

    let sign = payUtil.paysignjsapi(params, mchkey);

    // console.log('sign==', sign);
    //组装xml数据
    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>"; //appid
    formData += "<mch_id>" + mchid + "</mch_id>"; //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
    formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
    formData += "<sign>" + sign + "</sign>";
    formData += "</xml>";

    // var url = 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder';
    var url = 'https://api.mch.weixin.qq.com/pay/orderquery';

    request({
        url: url,
        method: 'POST',
        body: formData
    }, function(err, response, body) {

        // console.log(response)
        if (response.statusCode == 200) {

            xml2js.parseString(response.body, function(error, result) {

                // console.log(result)

                if (result.xml.return_code == 'SUCCESS') {
                    // console.log(result.xml)
                    // var prepay_id = result.xml.prepay_id[0];
                    res.json({
                        statusCode: 200,
                        msg: '支付成功'
                    });
                }

            })

        }

    })

})




module.exports = router;