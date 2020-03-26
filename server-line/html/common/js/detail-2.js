$(document).ready(function() {
    // 获取图片id
    let id = location.search.substr(1).split('=')[1];
    console.log(id)

    // 点击返回按钮
    $('#back').on('click', function() {
        window.history.back()
    })

    // 点击收藏
    //  $('#collect').on('click', function() {
    //      let that = $(this);

    //      // 将图片信息插入数据库
    //      Dingyuan.blogajax('POST', '/collect', {
    //          id: id
    //      }, function(response) {

    //          if (response.statusCode != '200') {
    //              // 没有登录、已经收藏过了、收藏失败
    //              $('.mint-toast').addClass('show');
    //              $('.mint-toast').find('span').text(response.message)
    //              setTimeout(function() {
    //                  $('.mint-toast').removeClass('show')
    //              }, 1000)
    //          }

    //          if (response.statusCode == '200') {
    //              // 收藏成功，改变按钮颜色               
    //              that.css({
    //                  color: "#b41783"
    //              })

    //              // 弹框提示收藏成功
    //              $('.mint-toast').addClass('show');
    //              $('.mint-toast').find('span').text(response.message)
    //              setTimeout(function() {
    //                  $('.mint-toast').removeClass('show')
    //              }, 1000)
    //          }

    //      }, function() {

    //      })
    //  })

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

    //  video 按钮闪动
    let opacity = 1;
    setInterval(function() {
        opacity -= 0.5;
        console.log(opacity);
        if (opacity <= 0) {
            opacity = 1;
        }
        $('#video_btn img').css({ 'opacity': opacity })
    }, 100);

    //  点击视频图像按钮
    $('#video_btn img').on('click', function() {
        // 判断是否是贴吧浏览器
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
            let img = $('<img>');
            img[0].src = '../common/images/Browser.jpg';
            img.css({
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                right: 0,
                margin: 'auto',
                width: '100%',
                height: '100%'
            });
            $('body').append(img);
        } else {
            window.location.href = 'http://www.91alex.com/video'
        }
        //  return;
    });




    //获取图片详情页
    Dingyuan.blogajax('GET', '/pictureDetail', {
        id: id
    }, function(response) {

        let data = response.result[0];
        let imgDetail = {
            list: data.list,
            title: data.title
        }
        var imgTitle = $('<h1>' + imgDetail.title + '</h1>');
        $('#img-list').append(imgTitle);

        console.log(data);
        // 判断是否是vip图片
        //  if (!data.vip) {
        // 不是vip图片，无论用户是否登录，都对用户进行展示

        // 隐藏收藏按钮
        //  $('#interaction').removeClass('show').addClass('hidden');

        // 隐藏登录按钮
        //  $('#login').removeClass('show').addClass('hidden');

        // 隐藏VIP按钮
        //  $('#vip').removeClass('show').addClass('hidden');

        for (let i = 0; i < imgDetail.list.length; i++) {
            // 显示图片列表 
            let img = $('<img src=../' + imgDetail.list[i] + '>');
            $('#img-list').append(img);
        }
        return;
        //  }


        //  是 vip图片才进行下面的判断
        if (response.statusCode == '100') {
            //已经登录vip权限到期
            //达到浏览量上线,不是VIP

            // 隐藏收藏按钮
            $('#interaction').removeClass('show').addClass('hidden');

            // 隐藏登录按钮
            $('#login').removeClass('show').addClass('hidden');

            // 显示VIP按钮
            $('#vip').addClass('show').removeClass('hidden');

            for (let i = 0; i < imgDetail.list.length; i++) {
                // 显示图片列表 
                if (i == 0) {
                    let img = $('<img onclick="return false" alt=' + imgDetail.title + ' title=' + imgDetail.title + ' src=../' + imgDetail.list[i] + '>');
                    $('#img-list').append(img);
                } else {
                    let imgSrc = imgDetail.list[i].split('/')[0] + '/' + imgDetail.list[i].split('/')[1] + '/mini/' + imgDetail.list[i].split('/')[2];

                    let img = $('<img id="' + i + 'de"' + ' class="mini" src=../' + imgSrc + ' alt=' + imgDetail.title + ' title=' + imgDetail.title + '>');

                    img.css({
                        height: '220px'
                    })
                    let imgWrap = $('<div class="img-wrap"></div>');
                    imgWrap.append($('<div class="cover"></div>'))
                    imgWrap.append(img);
                    $('#img-list').append(imgWrap);

                }
            }
        } else if (response.statusCode == '200') {
            // 用户是VIP 并且没有过期

            // 显示收藏按钮
            $('#interaction').removeClass('hidden').addClass('show');

            // 隐藏登录按钮
            $('#login').removeClass('show').addClass('hidden');

            // 隐藏VIP按钮
            $('#vip').removeClass('show').addClass('hidden');

            for (let i = 0; i < imgDetail.list.length; i++) {
                // 显示图片列表 
                let img = $('<img src=../' + imgDetail.list[i] + '>');
                $('#img-list').append(img);
            }
        } else {
            // 未登录 statusCode = 101

            // 隐藏收藏按钮
            $('#interaction').removeClass('show').addClass('hidden');

            // 隐藏VIP按钮
            $('#vip').removeClass('show').addClass('hidden');

            // 显示登录按钮
            $('#login').addClass('show').removeClass('hidden');

            for (let i = 0; i < imgDetail.list.length; i++) {
                // 显示图片列表 
                if (i == 0) {
                    //  console.log(imgTitle);
                    let img = $('<img onclick="return false" alt=' + imgDetail.title + ' title=' + imgDetail.title + ' src=../' + imgDetail.list[i] + '>');
                    $('#img-list').append(img);
                } else {
                    let imgSrc = imgDetail.list[i].split('/')[0] + '/' + imgDetail.list[i].split('/')[1] + '/mini/' + imgDetail.list[i].split('/')[2];
                    let img = $('<img id="' + i + 'de"' + ' class="mini" src=../' + imgSrc + ' alt=' + imgDetail.title + ' title=' + imgDetail.title + '>');
                    img.css({
                        height: '220px'
                    })
                    let imgWrap = $('<div class="img-wrap"></div>');
                    imgWrap.append($('<div class="cover"></div>'));
                    imgWrap.append(img);
                    $('#img-list').append(imgWrap);

                }
            }

        }

    }, function(err) {
        console.log(err);
    })

})