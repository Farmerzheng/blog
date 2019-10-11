// 登出功能
$('#logout').on('click', logoutHandler);

function logoutHandler() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/logout",
        data: {

        },
        success: function(response) {
            console.log(response)
                //  密码输入不一致

        }
    });
}