 $(document).ready(function() {

     // http://www.91alex.com/detail/index.html?id=5e47e595592929507c8c9db2&cuid=baidutiebaappe77caaca-c1e8-45f3-980b-e1dea8317d4c&cuid_galaxy2=22B2212FE637C4C8B9EE3A4A3E1AA577|0&cuid_gid=&timestamp=1581996491383&_client_version=11.1.8.2

     let id = null;

     let paramArr = location.search.substr(1).split('&');

     for (i = 0; i < paramArr.length; i++) {
         if (paramArr[i].split('=')[0] == 'id') {
             id = paramArr[i].split('=')[1];
         }
     }

     console.log('picture id is ' + id);

     // 点击返回按钮
     $('#back').on('click', function() {
         window.history.back()
     });

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

     //  video 按钮闪动
     //  let opacity = 1;
     //  setInterval(function() {
     //      opacity -= 0.5;
     //      console.log(opacity);
     //      if (opacity <= 0) {
     //          opacity = 1;
     //      }
     //      $('#video_btn img').css({ 'opacity': opacity })
     //  }, 100);

     //  点击视频图像按钮
     $('#video_btn img').on('click', function() {
         window.location.href = 'http://www.91alex.com/video';

     });



     //获取图片详情列表
     getImageDetailList();

     function getImageDetailList() {

         // 判断图片id 是否发生变化，若变化，则重置imageDetailPage=1
         let pictureId = sessionStorage.getItem("pictureId");
         if (pictureId != id) {
             //  如果本地存储的pictureId 不等于 地址参数中的id
             //重新设置页面图片的 id
             sessionStorage.setItem("pictureId", id);

             //重置imageDetailPage=1
             sessionStorage.setItem("imageDetailPage", '1');
         };

         // 获取当前页码
         let imageDetailPage = sessionStorage.getItem("imageDetailPage");
         //没有当前页码，默认是第一页
         if (!imageDetailPage) {
             sessionStorage.setItem("imageDetailPage", '1');
         };

         //每页展示的图片数
         let perPageNum = 1;

         //获取图片详情页
         Dingyuan.blogajax('GET', '/pictureDetail', {
             id: id,
             page: sessionStorage.getItem("imageDetailPage"),
             perPage: 2
         }, function(response) {

             // 清空页面
             $('#img-list').html('');

             let data = response.result[0];
             let imgDetail = {
                 list: data.list,
                 title: data.title
             };
             //  图片标题
             var imgTitle = $('<h1>' + imgDetail.title + '</h1>');
             $('#img-list').append(imgTitle);

             // 分页
             $('.page').pagination({
                 coping: true,
                 totalData: imgDetail.list.length,
                 showData: perPageNum,
                 count: 1, //当前页前后页码数
                 current: sessionStorage.getItem("imageDetailPage"), //当前页码
                 callback: function(api) {
                     sessionStorage.setItem("imageDetailPage", api.getCurrent());
                     getImageDetailList();
                     window.scrollTo(0, 0);
                 }
             });

             //展示
             for (let i = (imageDetailPage - 1) * perPageNum; i < imageDetailPage * perPageNum; i++) {
                 // 显示图片列表 
                 let img = $('<img src=../' + imgDetail.list[i] + '>');
                 $('#img-list').append(img);
             }

         }, function(err) {
             console.log(err);
         })
     };
 })