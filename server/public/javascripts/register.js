 $('#submit').on('click', submitHandler);

 function submitHandler() {
     $.ajax({
         method: "POST",
         url: "http://localhost:3000/register",
         data: {
             name: $('#name').val(),
             password: $('#password').val(),
             password_repeat: $('#password_repeat').val(),
             email: $('#email').val()
         },
         success: function(response) {
             console.log(response)
                 //  密码输入不一致
             if (response.status == '100') {
                 alert(response.message)
             }
             //  已经存在此用户
             if (response.status == '101') {
                 alert(response.message)
             }
             //  插入用户失败
             if (response.status == '102') {
                 alert(response.message)
             }
             // 注册成功
             if (response.status == '200') {
                 alert('注册成功');
                 //  返回主页
                 window.location.href = '/index.html'
             }
         }
     });
 }