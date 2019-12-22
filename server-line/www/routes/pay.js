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
var orderNum = 160;



// 读取图片总数
router.get("/", function(req, res, next) {

    // let code = req.query.code;
    // console.log(req.ip)

    // request('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + payConfig.wxAppId + '&secret=' + payConfig.wxAppSecret + '&code=' + code + '&grant_type=authorization_code', (err, response, bodys) => {

    // console.log(response.body);
    // let data = JSON.parse(response.body);

    // let access_token = data.access_token;

    // let openid = data.openid;


    // 生成订单号
    orderNum += 1;

    let appid = payConfig.wxAppId;
    let mchid = payConfig.wxMchId;
    let nonce_str = payUtil.createNonceStr(); //随机字符串，不长于32位
    let body = '成为VIP会员'; //商品简单描述
    let out_trade_no = orderNum; //商户订单号
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
                /* response.body 的内容如下： "<xml><return_code><![CDATA[SUCCESS]]></return_code> <return_msg><![CDATA[OK]]></return_msg> <appid><![CDATA[wx470416dc40550534]]></appid> <mch_id><![CDATA[1565631271]]></mch_id> <nonce_str><![CDATA[7NFAlq3X73iGQYzk]]></nonce_str> <sign><![CDATA[1E5B680E406B65CAF96DBEF93575D228]]></sign> <result_code><![CDATA[SUCCESS]]></result_code> <prepay_id><![CDATA[wx21201731383117c307ed15f71634598700]]></prepay_id> <trade_type><![CDATA[MWEB]]></trade_type> <mweb_url><![CDATA[https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx21201731383117c307ed15f71634598700&package=3002775383]]></mweb_url> </xml>"
                 */

                xml2js.parseString(response.body, function(error, result) {
                    // res.json({
                    //     result: result,
                    //     pay: 'pa1223'
                    // });
                    // console.log('长度===', response.xml.prepay_id.text().length);
                    // res.json({
                    //     result: result
                    // })
                    var prepay_id = result.xml.prepay_id[0];
                    // console.log('解析后的prepay_id==', prepay_id);


                    //将预支付订单和其他信息一起签名后返回给前端
                    let timestamp = payUtil.createTimeStamp();
                    let finalsign = payUtil.paysignjsapifinal(appid, mchid, prepay_id, nonce_str, timestamp, mchkey);
                    // console.log('解析后的finalsign==', finalsign);


                    res.json({
                        'appId': appid,
                        'partnerId': mchid,
                        'prepayId': prepay_id,
                        'nonceStr': nonce_str,
                        'timeStamp': timestamp,
                        'package': 'Sign=WXPay',
                        'sign': finalsign,
                        'mweb_url': result.xml.mweb_url[0],
                        'ip': spbill_create_ip
                    });
                })

            }

        })
        // })
})

// 支付结果通知/退款结果通知
router.post('/notify', xmlparser({
    trim: false,
    explicitArray: false
}), function(req, res, next) {

    let data = req.body.xml;
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
        res.end(jsonToXml(sendData));
    }

});



module.exports = router;