 // 判断用户是否登录
 function isLogin() {
     Dingyuan.blogajax('GET', '/login/islogin', {}, function(response) {
         console.log(response);
         if (response.statusCode == '200') {
             $('#mine').addClass('show');

             // 侧边导航
             $('#user').addClass('show');
             console.log(!response.message.tel);
             if (response.message.tel) {
                 $('#user').text(response.message.tel);
                 $('#user_nav').text(response.message.tel);
                 sessionStorage.setItem("tel", response.message.tel);
             } else {
                 $('#user .figureurl').attr({ src: response.message.figureurl });
                 $('#user .nickname').text(response.message.nickname);
                 $('#user_nav').text(response.message.nickname);
                 sessionStorage.setItem("qqOpenid", response.message.qqOpenid);
             }

             $('#login_bar').addClass('hidden');
             $('#pc_login').addClass('hidden');
             window.tel = response.message.tel;
         } else {
             $('#login').addClass('show');

             // 侧边导航
             $('#user').addClass('hidden')
             $('#login_bar').addClass('show')
         }
     }, function(error) {
         console.log(error)
     })
 }
 isLogin();