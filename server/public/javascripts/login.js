 $('#submit').on('click', submitHandler);

 function submitHandler() {
     $.ajax({
         method: "POST",
         url: "http://localhost:3000/login",
         data: {
             name: $('#name').val(),
             password: $('#password').val()
         },
         success: function(response) {

             console.log(response)
                 //  用户不存在
             if (response.status == '100') {
                 alert(response.message)
             }
             // 密码错误
             if (response.status == '101') {
                 alert(response.message)
             }
             // 登录成功
             if (response.status == '200') {
                 alert('登录成功');
                 //  返回主页
                 window.location.href = '/'
             }
         }
     });
 }