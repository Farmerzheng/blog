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

// 获取图片信息

$.ajax({
    method: "GET",
    url: config.url + "/pictureList",
    success: function(response) {
        console.log(response);
        //     <ul class="picture-list">
        //     <li class="picture-item">
        //         <a href="">
        //             <img src="" alt="">
        //             <span></span>
        //         </a>
        //     </li>
        //     </ul>

        let dataArr = response.result;

        for (let i = 0; i < dataArr.length; i++) {
            let data = dataArr[i];

            let li = $(
                '<li class="picture-item">' +
                '<a>' +
                '<img src="' + data.list[0] + '">' +
                '<span>' + data.title + '</span>' +
                '</a>' +
                '</li>'
            )

            // for (let j = 0; j < data.list.length; j++) {

            // }

            $('.picture-list').append(li);

        }


    },
    error: function(err) {
        console.log(err);
    }
});