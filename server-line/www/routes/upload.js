var express = require("express");
var Picture = require("../models/picture");

//2、引入multer模块
/*multer在解析完成后，会向request对象中添加一个body对象和一个file或者files对象(上传多个文件的时候用files对象)，其中body中包含提交的字段，而file中包含上传的文件*/
const multer = require("multer");

// 引入操作表单的模块
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
var router = express.Router();


//设置保存规则
var storage = multer.diskStorage({

    //指定文件上传到服务器的路径
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"))
    },

    //指定上传到服务器文件的名称
    filename: function(req, file, cb) {
        // 图片类型
        let extName = file.originalname.slice(file.originalname.lastIndexOf('.'));

        //以当前时间戳对上传文件进行重命名
        var newName = new Date().getTime() + extName;

        cb(null, newName)
    }
})

//设置过滤规则（可选）
var imageFilter = function(req, file, cb) {
    var acceptableMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
        //微信公众号只接收上述四种类型的图片
    if (acceptableMime.indexOf(file.mimetype) !== -1) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

//设置限制（可选）
var imageLimit = {
    fieldSize: '20MB'
}


var upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: imageLimit
})


/*使用 在使用路由的时候调用upload方法 name值是客户端传递的key值

upload.single('key值'): 当传递单个文件的时候， 对文件的解析

upload.array('key值', maxCout)： 当传递一组文件的时候， 对文件的解析 key值是前端传递的key值 maxcout是最多能传递多少个文件

upload.fields([{
    name: 'key值',
    maxCount: num
}, {
    name: 'key值',
    maxCount: num
}])： 

当传递多个文件域的时候, 对文件的解析

*/
// var cpUpload = upload.fields([{
//     name: 'images',
//     maxCount: 100
// }, {
//     name: 'img_type',
//     maxCount: 10
// }, {
//     name: 'img_title',
//     maxCount: 10
// }, {
//     name: 'img_vip',
//     maxCount: 10
// }])

var cpUpload = upload.array('images', 60)

// 上传图片
router.post("/", cpUpload, function(req, res, next) {



    // 存储在数据库中的图片路径数组
    var filesUrl = [];
    // var errCount = 0;

    // console.log(req, res, next)
    // var form = new formidable.IncomingForm();
    var targetDir = path.join(__dirname, "../public/images");

    //文件保存的目录
    // form.uploadDir = targetDir;

    // form.uploadDir = "./tmp"; //文件保存在系统临时目录
    // form.maxFieldsSize = 100 * 1024 * 1024; //上传文件大小限制为最大10M
    // form.keepExtensions = true; //使用文件的原扩展名


    // 新建图片对象
    // let picture = {};

    // _fileParse();

    // 文件解析与保存
    // function _fileParse() {
    // form.parse(req, function(err, fields, files) {
    // if (err) throw err;
    /* 
          当用户使用form表单提交数据时，表单中可能会包含两类数据：文件/图片数据、普通表单数据。
          formidable解析用户后，会将这两种数据分别放到files和fields两个回调参数中。
          fields 是普通表单数据 
          files 是文件数据
          */
    // console.log(fields, files)
    switch (req.body.img_type) {
        case "1":
            //根据图片类型修改目标目录 
            targetDir = targetDir + "\\1";
            break;
        case "2":
            targetDir = targetDir + "\\2";
            break;
        case "3":
            targetDir = targetDir + "\\3";
            break;
        case "4":
            targetDir = targetDir + "\\4";
            break;
        case "5":
            targetDir = targetDir + "\\5";
            break;
        case "6":
            targetDir = targetDir + "\\6";
            break;
        case "7":
            targetDir = targetDir + "\\7";
            break;
        case "8":
            targetDir = targetDir + "\\8";
    }


    var keys = Object.keys(req.files);

    keys.forEach(function(key) {
        // 获得图片存储的临时路径  "tmp\upload_cef99b58c61476cc8b86406f44f88cf1.JPG"
        // var filePath = files[key].path;
        // console.log('图片临时存储路径' + filePath)
        // 获得图片类型
        // var fileExt = filePath.substring(filePath.lastIndexOf("."));
        // if (".jpg.jpeg.png.gif".indexOf(fileExt.toLowerCase()) === -1) {
        //     errCount += 1;
        // } else {
        //以当前时间戳对上传文件进行重命名
        // var newName = new Date().getTime() + fileExt;

        //改变名字（重命名），异步
        // fs.rename(filePath, targetDir + "/" + newName, (err) => {
        //         console.log(err)
        // cb({
        //     status: 2, //上传成功啦
        //     params: params,
        //     newName: newName,
        //     msg: "上传成功"
        // })
        // })
        // 获得图片的实际存储路径
        // var targetFile = path.join(targetDir, fileName);
        // console.log('图片实际上传路径：' + targetFile)

        //移动文件
        console.log(req.files[key].path, targetDir + '/' + req.files[key].filename)
        fs.renameSync(req.files[key].path, targetDir + '\\' + req.files[key].filename);

        // 图片的的Url（相对路径）添加到图片数组                    
        filesUrl.push("images/" + req.body.img_type + "/" + req.files[key].filename);
        // }
    });

    var img_vip = req.body.img_vip == '1' ? true : false;

    //获取当前时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    // console.log(getNowFormatDate())

    let pictureSchema = new Picture({
        title: req.body.img_title,
        vip: img_vip,
        type: req.body.img_type,
        time: getNowFormatDate(),
        list: filesUrl
    });

    // console.log(studentSchema);

    //将学生数据存储在students 集合中
    pictureSchema.save(function(err, doc) {
        if (err) {
            res.json({
                statusCode: "100",
                message: "插入失败"
            });
        } else {
            // 返回前台投票成功的信息
            res.json({
                statusCode: "0",
                message: "上传成功",
                data: doc
            });
        }
    });

    // 返回上传信息
    // res.json({ filesUrl: filesUrl, success: keys.length - errCount, error: errCount });
    // });
    // }
});

module.exports = router;