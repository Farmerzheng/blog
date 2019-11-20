// 登出功能
$("#logout").on("click", logoutHandler);

function logoutHandler() {
    $.ajax({
        method: "GET",
        url: config.url + "/logout",
        data: {},
        success: function(response) {
            console.log(response);
            //  密码输入不一致
        }
    });
}

// 发表文章
// $("#publish").on("click", publishHandler);

// function publishHandler() {
//     window.location.href = "/publish";
// }

// 上传图片
// $("#upload").on("click", uploadHandler);

// function uploadHandler() {
//     window.location.href = "/upload";
// }

// 读取文章信息
/*
$.ajax({
    method: "GET",
    url: "http://localhost:3000/readArticle",
    success: function(response) {
        // console.log(response);

        if (response.status == "100") {
            alert("请先登录");
            location.href = "/login";
            return;
        }
        if (response.status == "200") {
            // 读取成功
            let articles = response.result;
            // console.log(response)

            for (let i = 0; i < articles.length; i++) {
                let content = $(
                    "<h3 class='title'>" +
                    articles[i].title +
                    "</h3>" +
                    "<p class='subtitle'>" +
                    "<span class='name'>" +
                    articles[i].name +
                    "</span>" +
                    "<span class='time'>" +
                    articles[i].time +
                    "</span>" +
                    "</p>" +
                    articles[i].article
                );
                // console.log(articles[i].time)
                $("#article").append(content);
            }
        }
    },
    error: function(err) {
        console.log(err);
    }
});*/

// 获取首页图片列表信息

$.ajax({
    method: "GET",
    url: config.url + "/pictureList",
    success: function(response) {
        console.log(response);

        let dataArr = response.result;

        for (let i = 0; i < dataArr.length; i++) {
            let data = dataArr[i];

            let li = $(
                '<li class="picture-item"' + 'id="' + data._id + '">' +
                '<a>' +
                '<img src="' + data.list[0] + '">' +
                '<span>' + data.title + '</span>' +
                '</a>' +
                '</li>'
            )

            // 点击图片跳转到图片详情页
            li.on('click', function() {
                console.log($(this).attr('id'));
                window.id = $(this).attr('id');
                window.location.href = '/view/detail/?' + $(this).attr('id')
            })


            $('.picture-list').append(li);

        }


    },
    error: function(err) {
        console.log(err);
    }
});


// 点击导航链接
$('.nav-item').on('click', function() {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    // 获取a链接锚点
    // console.log(typeof(this.hash.slice(1)));

    let type = this.hash.slice(1);

    // 请求相应数据
    $.ajax({
        method: "GET",
        url: config.url + "/pictureType",
        data: {
            type: type
        },
        success: function(response) {
            console.log(response);
            // 刷新页面
            $('.picture-list').html('');
            let dataArr = response.result;

            for (let i = 0; i < dataArr.length; i++) {
                let data = dataArr[i];
                let li = $(
                        '<li class="picture-item"' + 'id="' + data._id + '">' +
                        '<a>' +
                        '<img src="' + data.list[0] + '">' +
                        '<span>' + data.title + '</span>' +
                        '</a>' +
                        '</li>'
                    )
                    // 点击图片跳转到图片详情页
                li.on('click', function() {
                    console.log($(this).attr('id'));
                    window.id = $(this).attr('id');
                    window.location.href = '/view/detail/?' + $(this).attr('id')
                })
                $('.picture-list').append(li);
            }


        },
        error: function(err) {
            console.log(err);
        }
    });
})