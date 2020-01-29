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

   // 获取收藏图片列表信息
   Dingyuan.blogajax('GET', '/collect/pictureList', {}, function(response) {
       if (response.statusCode == '100') {
           // 用户没有登录，直接返回
           return;
       }
       // 导航显示用户名
       $('#user_nav').text(response.tel);

       let dataArr = response.result;

       for (let i = 0; i < dataArr.length; i++) {
           let data = dataArr[i];
           let li = $(
               '<li class="picture-item"' + 'id="' + data._id + '">' +
               '<a>' +
               '<img src="' + Dingyuan.config.url + '/' + data.list[0] + '">' +
               '<div>' +
               '<span class="title" >' + data.title + '</span>' +
               '<span class="time">' + data.time + '</span>' +
               '</div>' +
               '</a>' +
               '</li>'
           );
           //点击图片跳转到图片详情页
           li.on('click', function() {
               // console.log($(this).attr('id')); window.id=$(this).attr('id');
               window.location.href = '../detail/?id=' + $(this).attr('id')
           });
           $('.picture-list').append(li);
       }
   }, function() {

   })