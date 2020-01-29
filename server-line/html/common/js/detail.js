 $(document).ready(function() {
     // 获取图片id
     let id = location.search.substr(1).split('=')[1];
     console.log(id)

     // 点击返回按钮
     $('#back').on('click', function() {
         window.history.back()
     })

     // 点击收藏
     $('#collect').on('click', function() {
         let that = $(this);

         // 将图片信息插入数据库
         Dingyuan.blogajax('POST', '/collect', {
             id: id
         }, function(response) {

             if (response.statusCode != '200') {
                 // 没有登录、已经收藏过了、收藏失败
                 $('.mint-toast').addClass('show');
                 $('.mint-toast').find('span').text(response.message)
                 setTimeout(function() {
                     $('.mint-toast').removeClass('show')
                 }, 1000)
             }

             if (response.statusCode == '200') {
                 // 收藏成功，改变按钮颜色               
                 that.css({
                     color: "#b41783"
                 })

                 // 弹框提示收藏成功
                 $('.mint-toast').addClass('show');
                 $('.mint-toast').find('span').text(response.message)
                 setTimeout(function() {
                     $('.mint-toast').removeClass('show')
                 }, 1000)
             }

         }, function() {

         })
     })

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


     //获取图片详情页
     Dingyuan.blogajax('GET', '/pictureDetail', {
         id: id
     }, function(response) {

         let data = response.result[0];
         let imgDetail = {
             list: data.list,
             title: data.title
         }
         let imgTitle = $('<h1>' + imgDetail.title + '</h1>');
         $('#img-list').append(imgTitle);

         console.log(response.statusCode);


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
                     let img = $('<img onclick="return false" src=../' + imgDetail.list[i] + '>');
                     $('#img-list').append(img);
                 } else {
                     let imgSrc = imgDetail.list[i].split('/')[0] + '/' + imgDetail.list[i].split('/')[1] + '/mini/' + imgDetail.list[i].split('/')[2];
                     let img = $('<img id="' + i + 'de"' + ' class="mini" src=../' + imgSrc + '>');
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
                     let img = $('<img onclick="return false" src=../' + imgDetail.list[i] + '>');
                     $('#img-list').append(img);
                 } else {
                     let imgSrc = imgDetail.list[i].split('/')[0] + '/' + imgDetail.list[i].split('/')[1] + '/mini/' + imgDetail.list[i].split('/')[2];
                     let img = $('<img id="' + i + 'de"' + ' class="mini" src=../' + imgSrc + '>');
                     img.css({
                         height: '220px'
                     })
                     let imgWrap = $('<div class="img-wrap"></div>');
                     imgWrap.append($('<div class="cover"></div>'))
                     imgWrap.append(img);
                     $('#img-list').append(imgWrap);

                 }
             }

         }

     }, function(err) {
         console.log(err);
     })

 })