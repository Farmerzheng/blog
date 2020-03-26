$(document).ready(function() {

    // 把location.search处理成一个对象
    function parseUrlParams() {
        if (window.location.search.length <= 0) return false;
        var info = window.location.search.slice(1);
        var result = {};
        info.split('&').forEach(item => {
            result[decodeURIComponent(item.split('=')[0])] = decodeURIComponent(item.split('=')[1]);
        });
        return result;
    }

    let paramsObj = parseUrlParams();

    if (paramsObj) {

        //向服务器发送请求获取验证码
        Dingyuan.blogajax('GET', '/qq_login/get_info', {
                code: paramsObj.code
            },
            function(response) {
                console.log(response)
                    // window.location.href = response.redirect_url;
                    // if (response.statusCode == 100) {
                    //     alert(response.message);
                    //     window.location.href = '../zhuce'
                    // }
            },
            function() {

            })
    }



    // 获取图片id
    let id = location.search.substr(1).split('=')[1];
    console.log(id)

    // 点击返回按钮
    $('#back').on('click', function() {
        window.history.back();
    })

    // 点击收藏
    // $('#collect').on('click', function() {
    //     let that = $(this);

    //     // 将图片信息插入数据库
    //     Dingyuan.blogajax('POST', '/collect', {
    //         id: id
    //     }, function(response) {

    //         if (response.statusCode != '200') {
    //             // 没有登录、已经收藏过了、收藏失败
    //             $('.mint-toast').addClass('show');
    //             $('.mint-toast').find('span').text(response.message)
    //             setTimeout(function() {
    //                 $('.mint-toast').removeClass('show')
    //             }, 1000)
    //         }

    //         if (response.statusCode == '200') {
    //             // 收藏成功，改变按钮颜色               
    //             that.css({
    //                 color: "#b41783"
    //             })

    //             // 弹框提示收藏成功
    //             $('.mint-toast').addClass('show');
    //             $('.mint-toast').find('span').text(response.message)
    //             setTimeout(function() {
    //                 $('.mint-toast').removeClass('show')
    //             }, 1000)
    //         }

    //     }, function() {

    //     })
    // })

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

    };

    //获取视频列表
    getVideoList();

    function getVideoList() {

        let videoPage = sessionStorage.getItem("videoPage");
        if (!videoPage) {
            sessionStorage.setItem("videoPage", '1');
        };

        //获取视频列表
        Dingyuan.blogajax('GET', '/videos', {
            page: sessionStorage.getItem("videoPage"),
            perPage: 6
        }, function(response) {
            console.log(response);

            $('.page').pagination({
                coping: true,
                totalData: response.totalNum,
                showData: 6,
                count: 1, //当前页前后页码数
                current: sessionStorage.getItem("videoPage"), //当前页码
                callback: function(api) {
                    sessionStorage.setItem("videoPage", api.getCurrent());
                    getVideoList();
                    window.scrollTo(0, 0);
                }
            });

            // 清空页面
            $('#video_list').html('');

            let videoArr = response.result;
            let html = '';
            for (let i = 0; i < videoArr.length; i++) {
                let video = videoArr[i];
                // 三种视频格式，跳过两个
                if (i % 2 == 0) {
                    // console.log(video.url.slice(0, video.url.lastIndexOf('.')));
                    let videoUrl = video.url.slice(0, video.url.lastIndexOf('.'));

                    let li = $('<li class="video-item"></li>');
                    let videoDom = $('<video width="" height="" preload="none" controls ' +
                        'poster=' + Dingyuan.config.url + '/' + video.videoCover + '>' +
                        '<source src=' + Dingyuan.config.url + '/' + videoUrl + '.Ogg' + '>' +
                        '<source src=' + Dingyuan.config.url + '/' + videoUrl + '.mp4' + '>' +
                        '</video>');
                    // 点击视频,开始播放
                    videoDom.on('play', function() {
                        var video = $(this);
                        video.css({ display: 'block' });
                        // 停止播放
                        // videoDom[0].pause();

                        console.log('begin play');
                        // 判断是否是百度贴吧浏览器，如果是，跳转到手机浏览器浏览
                        function myBrowser() {
                            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                            var isTieba = userAgent.indexOf("tieba") > -1;
                            if (isTieba) {
                                return "tieba";
                            }
                        };

                        if (myBrowser() == 'tieba') {
                            // 提示在手机浏览器打开
                            //  alert('tieba');
                            let cover = $('<div></div>');
                            cover.css({
                                position: 'fixed',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                right: 0,
                                margin: 'auto',
                                'background-color': '#000',
                                width: '100%',
                                height: '100%',
                                opacity: 0.9
                            });
                            let img = $('<img>');
                            img[0].src = '../common/images/Browser.png';
                            img.css({
                                'margin-top': '50px',
                                width: '100%'
                            });
                            cover.append(img);
                            $('body').append(cover);

                            // 暂停播放
                            videoDom[0].pause();

                            return;
                        };

                        //判断用户是否是VIP
                        Dingyuan.blogajax('GET', '/pictureDetail', {
                            id: 'video'
                        }, function(response) {
                            console.log(response.statusCode);
                            if (response.statusCode == '100') {
                                //已经登录vip权限到期,达到浏览量上线,不是VIP

                                // 暂停播放
                                videoDom[0].pause();

                                // 提示用户是否需要注册VIP
                                var msg = "您还不是VIP用户或VIP到期，1元成为VIP？";
                                if (confirm(msg) == true) {
                                    // 跳转到vip界面
                                    window.location.href = 'http://www.91alex.com/cheap';
                                } else {
                                    // 暂停播放
                                    videoDom[0].pause();
                                };

                            } else if (response.statusCode == '200') {
                                // 用户是VIP 并且没有过期
                                alert('尊敬的VIP会员，小站每日更新，欢迎您的到来！');
                                videoDom[0].play();
                            } else {
                                // 未登录 statusCode = 101    
                                videoDom[0].pause();
                                // video.css({ display: 'none' });
                                // 弹出登录提示框
                                // $("#mymodal").modal("show");

                                //按下确定按钮
                                // $('#login_confirm').on('click', function() {

                                // 提示用户是否需要注册VIP
                                var msg = "您还未登录，请先登录";
                                if (confirm(msg) == true) {
                                    // 跳转到vip界面
                                    window.location.href = 'http://www.91alex.com/denglu';
                                } else {
                                    // 暂停播放
                                    videoDom[0].pause();
                                };

                                // });

                                //按下取消按钮
                                // $('#login_cancel').on('click', function() {
                                //     video.css({ display: 'block' });
                                // });
                            }
                        }, function() {

                        });
                    });

                    let h2 = $('<h2>' + video.title + '</h2>');
                    let span = $('<span>' + video.time + '</span>');
                    li.append(videoDom);
                    li.append(h2);
                    li.append(span);
                    $('#video_list').append(li);
                }


            };


        }, function(err) {
            console.log(err);
        })
    }



})