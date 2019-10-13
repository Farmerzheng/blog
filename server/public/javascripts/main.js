// 登出功能
$("#logout").on("click", logoutHandler);

function logoutHandler() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/logout",
        data: {},
        success: function(response) {
            console.log(response);
            //  密码输入不一致
        }
    });
}

// 发表文章
$("#publish").on("click", publishHandler);

function publishHandler() {
    window.location.href = "/publish";
}

// 上传图片
$("#upload").on("click", uploadHandler);

function uploadHandler() {
    window.location.href = "/upload";
}

// 读取文章信息

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
});