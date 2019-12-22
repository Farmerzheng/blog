window.Dingyuan = window.Dingyuan || {};

window.Dingyuan.config = {
    url: 'http://www.91alex.com',
    viewUrl: 'http://www.91alex.com'
}

/**
 * 后台通信函数
 * @param data {object} 上传参数集合
 * @param ajaxBtn {string|Element} 上传按钮
 * @param fnSuccess  {function}  成功后的回调函数, 参数为返回的json对象
 * @param fnError {function}  失败后的回调函数
 */
window.Dingyuan.blogajax = function(method, url, data, fnSuccess, fnError) {

    var msg = "ok";

    method = method || "get";

    var timeout = 150000; // 150秒超时

    var backtime = 3000; // 3秒恢复按钮状态

    fnSuccess = fnSuccess || function() {};

    fnError = fnError || function() {};

    //config url + request url
    url = Dingyuan.config.url + url;

    // console.log(url);

    //对$.ajax網絡請求函數进行再封装    
    $.ajax({
        url: url,
        data: data,
        timeout: timeout,
        type: method,
        success: function(data) {
            // console.log(data);
            if (data.statusCode == 200) {
                fnSuccess(data);
            } else {
                fnSuccess(data);
            }
        },
        error: function(jqXHR, textStatus) {
            // console.log(jqXHR, textStatus);
            fnError(jqXHR, textStatus);
        }
    });
    //$.ajax end
    // console.log("tourajax called!");
}