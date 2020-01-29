    // $(document).ready(function() {


    //判断是否微信登陆
    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        console.log(ua); //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }
    if (isWeiXin()) {
        // 微信分享代码
        weixinShare()
    } else {
        // alert("不是来自微信内置浏览器")
    }


    // 导航动画
    var navBtn = $(".nav-btn");
    var navInner = $(".nav");
    var navItemArr = $(".nav-item");

    navBtn.on("click", navBtnClickHandler);

    function navBtnClickHandler() {
        console.log(1)
        if (navInner.hasClass("unfold")) {
            console.log(2)
            navInner.removeClass("unfold");
        } else {
            console.log(3)
            navInner.addClass("unfold");
        }

    }



    // 点击最新按钮
    $('#new').on('click', function() {
        if (window.tel) {
            window.location.href = '/content'
        } else {
            window.location.href = '/content'
        }
    });
    // })

    function weixinShare() {
        Dingyuan.blogajax('POST', '/weixin_action', {
            url: location.href.split('#')[0]
        }, function(data) {

            console.log(data, 1)

            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'checkJsApi']
            });

            wx.ready(function() {
                console.log('ready success!')
                wx.updateAppMessageShareData({
                    title: '街拍艺术馆',
                    desc: '美丽源于发现，时尚源于生活，身边的美女今夜等你……',
                    link: 'http://www.91alex.com',
                    imgUrl: 'http://www.91alex.com/common/images/share.png',
                    success: function(res) {
                        //alert('success');
                    },
                    cancel: function(res) {
                        alert('cancel');
                    },
                    fail: function() {
                        alert('fail')
                    }
                });

                wx.updateTimelineShareData({
                    title: '街拍艺术馆',
                    desc: '美丽源于发现，时尚源于生活，身边的美女今夜等你……',
                    link: 'http://www.91alex.com',
                    imgUrl: 'http://www.91alex.com/common/images/share.png',
                    success: function(res) {
                        //alert('success');
                    },
                    cancel: function(res) {
                        alert('cancel');
                    },
                    fail: function() {
                        alert('fail')
                    }
                });



            });

            wx.error(function(res) {
                console.log('error');
            });

            wx.checkJsApi({
                jsApiList: [
                    'updateAppMessageShareData', 'updateTimelineShareData'
                ],
                success: function(res) {
                    console.log('checkJsApi success');
                },
                error: function(data) {
                    console.log(data)
                }
            });
        }, function(error) {
            console.log(error)
        })
    }