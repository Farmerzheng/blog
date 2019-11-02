 $('#post').on('click', submitHandler);

 function submitHandler() {
     $.ajax({
         method: "POST",
         url: config.url + "/publish",
         data: {
             title: $('#title').val(),
             article: $('#article').val()
         },
         success: function(response) {

             //  console.log(response)
             if (response.status == 0) {
                 alert('请先登录');
                 window.location.href = '/login'
             }

             if (response.status == '100') {
                 alert('发表失败')
             }

             if (response.status == '200') {
                 alert('发表成功');
                 location.href = '/'
             }
         }
     });
 }