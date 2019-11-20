var express = require("express");
var Picture = require("../models/picture");

// 引入操作表单的模块
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
var router = express.Router();

// 上传图片
router.post("/", function(req, res, next) {
    // console.log(req, res, next)
    var form = new formidable.IncomingForm();
    form.uploadDir = "./tmp"; //文件保存在系统临时目录
    form.maxFieldsSize = 100 * 1024 * 1024; //上传文件大小限制为最大10M
    form.keepExtensions = true; //使用文件的原扩展名

    var targetDir = path.join(__dirname, "../public/view/images");
    // 检查目标目录，不存在则创建
    fs.access(targetDir, function(err) {
        if (err) {
            fs.mkdirSync(targetDir);
        }
        _fileParse();
    });

    // 新建图片对象
    let picture = {};

    // 文件解析与保存
    function _fileParse() {
        form.parse(req, function(err, fields, files) {
            /* 
                  当用户使用form表单提交数据时，表单中可能会包含两类数据：文件/图片数据、普通表单数据。
                  formidable解析用户后，会将这两种数据分别放到files和fields两个回调参数中。
                  fields 是普通表单数据 
                  files 是文件数据
                  */
            // console.log(fields, files)
            switch (fields.img_type) {
                case "1":
                    targetDir = path.join(__dirname, "../public/view/images/1");
                    break;
                case "2":
                    targetDir = path.join(__dirname, "../public/view/images/2");
                    break;
                case "3":
                    targetDir = path.join(__dirname, "../public/view/images/3");
                    break;
                case "4":
                    targetDir = path.join(__dirname, "../public/view/images/4");
                    break;
                case "5":
                    targetDir = path.join(__dirname, "../public/view/images/5");
                    break;
                case "6":
                    targetDir = path.join(__dirname, "../public/view/images/6");
                    break;
                case "7":
                    targetDir = path.join(__dirname, "../public/view/images/7");
                    break;
                case "8":
                    targetDir = path.join(__dirname, "../public/view/images/8");
            }

            if (err) throw err;
            var filesUrl = [];
            var errCount = 0;

            var keys = Object.keys(files);

            keys.forEach(function(key) {
                var filePath = files[key].path;
                var fileExt = filePath.substring(filePath.lastIndexOf("."));
                if (".jpg.jpeg.png.gif".indexOf(fileExt.toLowerCase()) === -1) {
                    errCount += 1;
                } else {
                    //以当前时间戳对上传文件进行重命名
                    var fileName = new Date().getTime() + fileExt;
                    var targetFile = path.join(targetDir, fileName);
                    //移动文件
                    fs.renameSync(filePath, targetFile);
                    // 文件的Url（相对路径）
                    filesUrl.push("images/" + fields.img_type + "/" + fileName);
                }
            });

            var img_vip = fields.img_vip == '1' ? true : false;

            let pictureSchema = new Picture({
                title: fields.img_title,
                vip: img_vip,
                type: fields.img_type,
                list: filesUrl
            });

            // console.log(studentSchema);

            //将学生数据存储在students 集合中
            pictureSchema.save(function(err, doc) {
                if (err) {
                    res.json({
                        status: "100",
                        error: "插入失败"
                    });
                } else {
                    // 返回前台投票成功的信息
                    res.json({
                        status: "0",
                        message: "上传成功",
                        data: doc
                    });
                }
            });

            // 返回上传信息
            // res.json({ filesUrl: filesUrl, success: keys.length - errCount, error: errCount });
        });
    }
});

module.exports = router;