// 登录方式切换
$('#tab div').click(function() {
    $(this).addClass('active').siblings().removeClass('active');
    console.log($(this).attr('id'));
    if ($(this).attr('id') == 'tab_sms') {
        $('.sms-content').removeClass('hidden').siblings().addClass('hidden')
    } else {
        $('.qq-content').removeClass('hidden').siblings().addClass('hidden')
    }
});

// var qqAppID = '101847766';
// var qqAppkey = '0e4655d2f21916b18198de0d002ff9eb';
// var qqRedirect_uri = 'http%3A%2F%2Fwww.91alex.com%2Fcontent';
// QQ登录
function qqLogin() {
    //以下为按钮点击事件的逻辑。注意这里要重新打开窗口
    //否则后面跳转到QQ登录，授权页面时会直接缩小当前浏览器的窗口，而不是打开新窗口
    // var A = window.open('https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + qqAppID + '&redirect_uri=' + qqRedirect_uri + '&state=233&scope=get_user_info,list_album,upload_pic', "TencentLogin",
    //     "width=450,height=320,menubar=0,scrollbars=1,resizable = 1, status = 1, titlebar = 0, toolbar = 0, location = 1 ");

    let qq_tel = $('#qq_tel').val();
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (reg.test(qq_tel)) {
        // alert("邮箱格式正确");
    } else {
        alert("邮箱不正确");
        return;
    }




    //向服务器发送请求获取验证码
    Dingyuan.blogajax('GET', '/qq_login', {
            tel: qq_tel
        },
        function(response) {
            console.log(response)
            window.location.href = response.redirect_url;
            // if (response.statusCode == 100) {
            //     alert(response.message);
            //     window.location.href = '../zhuce'
            // }
        },
        function() {

        })
}




let timer = null,
    number = 60;

// 点击返回按钮
$('#back').on('click', function() {
    window.history.back()
})

// 点击获取验证码
$('#smsbtn').on('click', function() {

    var phone = $('#tel').val();
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
        alert("手机号码有误，请重填");
        return;
    }

    let that = $(this);
    timer = setInterval(() => {
        that.text(number + 's');
        number--;
        if (number == 0) {
            that.text('获取校验码');
            number = 60;
            clearInterval(timer);
        }
    }, 1000);


    //向服务器发送请求获取验证码
    Dingyuan.blogajax('POST', '/register/getCode', {
            tel: $('#tel').val()
        },
        function(response) {
            // if (response.statusCode == 100) {
            //     alert(response.message);
            //     window.location.href = '../zhuce'
            // }
        },
        function() {

        })
})

// 监听验证码的改变
$('#code').on('input propertychange change', function() {
    // 验证码大于四位，改变输入框状态
    if ($(this).val().length >= 4) {
        $('#loginBtn').removeClass('disabled')
    } else(
        $('#loginBtn').addClass('disabled')
    )
})

// 登录
$('#loginBtn').on('click', function() {

    // 验证码不足4位，不允许注册
    if ($('#code').val().length < 4) {
        return;
    }

    Dingyuan.blogajax('POST', '/register', {
        tel: $('#tel').val(),
        code: $('#code').val()
    }, function(response) {

        console.log(response)
            // 用户不存在
        if (response.statusCode == '100') {
            alert(response.message)
        }
        // 验证码错误
        if (response.statusCode == '102') {
            alert(response.message)
        }
        // 登录成功
        if (response.statusCode == '200') {
            alert('登录成功');
            // 返回主页
            window.location.href = '../video'
        }
    }, function(error) {
        console.log('error')
    })
});