   $(document).ready(function() {





       // 展示图片
       getPictureList()

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





       // let pageIndex = location.hash.split('?')[1].split('=')[1];

       // let type = location.hash.split('?')[0].substr(1);


       // // 改变导航链接的active状态
       // $('#' + type).siblings().removeClass('active');
       // $('#' + type).addClass('active');

       // console.log(pageIndex, type)

       // 点击导航链接
       $('.nav-item').on('click', function() {

           sessionStorage.setItem("category", $(this).attr('id'));
           sessionStorage.setItem("page", '1');

           // // 改变导航链接的active状态
           $('#' + sessionStorage.getItem("category")).addClass('active').siblings().removeClass('active');

           // 获取图片信息
           getPictureList();

       })




   });

   function getPictureList() {
       let category = sessionStorage.getItem("category");
       if (!category) {
           sessionStorage.setItem("category", 'new');
           sessionStorage.setItem("page", '1');
       }

       // 获取图片信息
       Dingyuan.blogajax('GET', "/pictureType", {
               type: sessionStorage.getItem("category"),
               perPage: 12,
               page: sessionStorage.getItem("page")
           },
           function(response) {
               console.log(response.totalNum); //总的图片数
               // 分页插件
               $('.page').pagination({
                   coping: true,
                   totalData: response.totalNum,
                   showData: 12,
                   count: 1, //当前页前后页码数
                   current: sessionStorage.getItem("page"), //当前页码
                   callback: function(api) {
                       sessionStorage.setItem("page", api.getCurrent());
                       getPictureList();
                       window.scrollTo(0, 0);
                   }
               });

               // 刷新页面
               $('.picture-list').html('');
               let dataArr = response.result;
               //    console.log(dataArr)

               for (let i = 0; i < dataArr.length; i++) {
                   let data = dataArr[i];

                   console.log(data.vip);
                   //将图片链接拼接到mini图片文件夹
                   let imgSrc = data.list[0].split('/')[0] + '/' + data.list[0].split('/')[1] + '/mini/' + data.list[0].split('/')[2];

                   if (data.vip == true) {
                       var li = $('<li class="picture-item vip"' + 'id = "' + data._id + '" > ' +
                           '<a>' +
                           '<img src="' + Dingyuan.config.url + '/' + imgSrc + '"' +
                           'alt=' + data.title +
                           ' title=' + data.title +
                           '>' +
                           '<div>' +
                           '<h2 class="img-title">' + data.title + '</h2>' +
                           '<span class="time">' + data.time + '</span>' +
                           '</div>' +
                           '</a>' +
                           '</li>');
                   } else {
                       var li = $('<li class="picture-item no-vip"' + 'id = "' + data._id + '" > ' +
                           '<a>' +
                           '<img src="' + Dingyuan.config.url + '/' + imgSrc + '"' +
                           'alt=' + data.title +
                           ' title=' + data.title +
                           '>' +
                           '<div>' +
                           '<h2 class="img-title">' + data.title + '</h2>' +
                           '<span class="time">' + data.time + '</span>' +
                           '</div>' +
                           '</a>' +
                           '</li>');
                   }

                   // 点击图片跳转到图片详情页
                   li.on('click', function() {
                       // console.log($(this).attr('id'));
                       // window.id = $(this).attr('id');
                       sessionStorage.setItem("imgId", data._id); //以“key”为名称存储一个值“value”
                       console.log(sessionStorage.getItem("imgId")); //获取名称为“key”的值
                       window.location.href = '/detail/index.html?id=' +
                           $(this).attr('id');
                   });
                   $('.picture-list').append(li);
               }
           },
           function(error) {

           })
   }