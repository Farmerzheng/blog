// 引入腾讯云短信sdk
var QcloudSms = require("qcloudsms_js");
// 短信应用 SDK AppID
var appid = 1400283544; // SDK AppID 以1400开头
// 短信应用 SDK AppKey
var appkey = "bc6f7e56046cf75b900636b2d3bd158c";
// 需要发送短信的手机号码
var phoneNumbers = ["18515471826"];
// 短信模板 ID，需要在短信控制台中申请
var templateId = 477456; // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
// 签名
var smsSign = "宁乡艾客访网络工作室"; // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请
// 实例化 QcloudSms
var qcloudsms = QcloudSms(appid, appkey);
// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
function callback(err, res, resData) {
    if (err) {
        console.log("err: ", err);
    } else {
        console.log("request data: ", res.req);
        console.log("response data: ", resData);
    }
}
//指定模板 ID 单发短信
var ssender = qcloudsms.SmsSingleSender();
var params = ["5478", 1];
ssender.sendWithParam("86", phoneNumbers[0], templateId,
    params, smsSign, "", "", callback);