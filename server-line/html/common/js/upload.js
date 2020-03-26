  // $(document).ready(function() {
  function fileSelected() {
      var file = document.getElementById('fileToUpload').files[0];
      if (file) {
          var fileSize = 0;
          if (file.size > 1024 * 1024) {
              fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
          } else {
              fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
          }
          document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
          document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
          document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
      }
  }




  //绑定下拉框change事件，当下来框改变时调用 SelectChange()方法
  $("#select").change(function() {
      console.log($('#select').val())
  });


  /* HTML5定义了FileReader作为文件API的重要成员用于读取文件，根据W3C的定义，FileReader接口提供了读取文件的方法和包含读取结果的事件模型。
   */
  // 检测浏览器对FileReader的支持
  if (window.FileReader) {
      var fr = new FileReader();
  } else {
      console.log('您的电脑不支持FileReader')
  }

  // 定义图片数组，用来存放上传的图片
  var imgArr = [];

  // 选择图片
  function selectImage(imgFile) {
      // 获取到图片文件
      var file = imgFile.files[0];
      // 将图片文件添加到存储文件的数组
      imgArr.push(file);

      var reader = new FileReader();
      //用文件加载器加载文件
      reader.readAsDataURL(file);
      reader.onload = function(e) {
          // 图片加载完成，将图片展示在浏览器上
          var li = $('<li></li>');
          li.addClass('upload-li');
          li.html('<div class="item image">' +
              '<img class="upload-image" src="' + e.target.result + '" />' +
              '<img class="delete-image" src="../../common/images/delete.png" />' +
              '</div>');
          $('#uploadUL').prepend(li)
      }
  }


  // 选择视频
  var videoFile = null;

  function selectVideo(file) {
      // 获取到图片文件
      videoFile = file.files[0];
  }

  // 选择视频封面
  var videoCover = null;

  function selectVideoCover(file) {
      videoCover = file.files[0];
  }

  let timer = null;

  function uploadProgress(evt) {

      if (evt.lengthComputable) {
          var percentComplete = Math.round(evt.loaded * 100 / evt.total);
          //timer = setInterval(function() {
          console.log(evt.lengthComputable, evt.loaded, evt.total, percentComplete);
          var tiao = $(".tiao");
          tiao.css("width", percentComplete + "%").html(percentComplete + "%");
          // }, 100)
          document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
      } else {
          document.getElementById('progressNumber').innerHTML = '无法计算';
      }
  }

  function uploadComplete(evt) {
      /* 当服务器响应后，这个事件就会被触发 */
      console.log(evt.target.responseText);
  }

  function uploadFailed(evt) {
      console.log("上传文件发生了错误尝试");
  }

  function uploadCanceled(evt) {
      console.log("上传被用户取消或者浏览器断开连接");
  }

  // 点击按钮上传图片
  $('#upload').on('click', uploadHandler);

  // 点击按钮上传视频
  $('#upload_video').on('click', uploadHandler_video);

  function uploadHandler_video() {
      var formData = new FormData();

      //   for (var i = 0; i < imgArr.length; i++) {
      //       // 将图片添加到formData中
      //       formData.append('images', imgArr[i]);
      //       // console.log(imgArr[i])
      //   }

      // 将视频资源添加到formData中
      formData.append('video', videoFile);
      formData.append('video', videoCover);
      formData.append('video_title', $('#video_title').val());
      // 将图片类型存入formData
      //   formData.append('img_type', $('#img_select').val());
      //   formData.append('img_title', $('#img_title').val());
      //   formData.append('img_vip', $('#img_vip').val());

      var xhr = new XMLHttpRequest();
      // var fd = new FormData(document.getElementById('form1'));

      /* 事件监听 */
      //   xhr.upload.addEventListener("progress", uploadProgress, false);
      //   xhr.addEventListener("load", uploadComplete, false);
      //   xhr.addEventListener("error", uploadFailed, false);
      //   xhr.addEventListener("abort", uploadCanceled, false);
      /* 下面的url一定要改成你要发送文件的服务器url */
      xhr.open("POST", Dingyuan.config.url + '/upload/video');
      xhr.send(formData);
  }

  function uploadHandler() {


      var formData = new FormData();

      for (var i = 0; i < imgArr.length; i++) {
          // 将图片添加到formData中
          formData.append('images', imgArr[i]);
          // console.log(imgArr[i])
      }

      // 将图片类型存入formData
      formData.append('img_type', $('#img_select').val());
      formData.append('img_title', $('#img_title').val());
      formData.append('img_vip', $('#img_vip').val());

      var xhr = new XMLHttpRequest();
      // var fd = new FormData(document.getElementById('form1'));

      /* 事件监听 */
      xhr.upload.addEventListener("progress", uploadProgress, false);
      xhr.addEventListener("load", uploadComplete, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
      /* 下面的url一定要改成你要发送文件的服务器url */
      xhr.open("POST", Dingyuan.config.url + '/upload');
      xhr.send(formData);

  }
  // })