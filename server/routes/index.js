var express = require("express");
var User = require("../models/user.js");
// 添加支持markdown发表文章的功能
var Article = require("../models/article");
var markdown = require('markdown').markdown;
// 引入操作表单的模块
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
var router = express.Router();

/* 首页*/

// 读取文章信息
router.get("/readArticle", function(req, res, next) {

    // 用户没有登录
    if (!req.session.user) {
        return res.json({
            status: '100',
            message: '请先登录'
        })
    }
    // 用户已经登录
    Article.find({
        name: req.session.user.name
    }).then(articles => {
        // 重新记录用户登录状态
        req.session.user = req.session.user;

        if (!articles) {
            res.json({
                status: '101',
                message: '读取错误'
            })
        };
        // 使用 markdown 发表文章
        articles.forEach(function(doc) {
            doc.article = markdown.toHTML(doc.article)
        });
        // console.log(articles)
        res.json({
            status: '200',
            message: '读取成功',
            result: articles
        })
    })

});

// 上传图片
router.post('/upload', function(req, res, next) {
    // console.log(req, res, next)
    var form = new formidable.IncomingForm();
    form.uploadDir = './tmp'; //文件保存在系统临时目录
    form.maxFieldsSize = 10 * 1024 * 1024; //上传文件大小限制为最大10M  
    form.keepExtensions = true; //使用文件的原扩展名

    var targetDir = path.join(__dirname, '../public/images');
    // 检查目标目录，不存在则创建
    fs.access(targetDir, function(err) {
        if (err) {
            fs.mkdirSync(targetDir);
        }
        _fileParse();
    });

    // 新建学生对象
    let student = {}

    // 文件解析与保存
    function _fileParse() {
        form.parse(req, function(err, fields, files) {

            /* 
            当用户使用form表单提交数据时，表单中可能会包含两类数据：文件/图片数据、普通表单数据。
            formidable解析用户后，会将这两种数据分别放到files和fields两个回调参数中。
            fields 是普通表单数据 
            files 是文件数据
            */
            console.log(fields, files)
                //存储到数据库中的student
                // student.number = fields.number;
                // student.name = fields.name;
                // student.voteNum = fields.voteNum;

            if (err) throw err;
            var filesUrl = [];
            var errCount = 0;

            var keys = Object.keys(files);
            keys.forEach(function(key) {
                var filePath = files[key].path;
                var fileExt = filePath.substring(filePath.lastIndexOf('.'));
                if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
                    errCount += 1;
                } else {
                    //以当前时间戳对上传文件进行重命名
                    var fileName = new Date().getTime() + fileExt;
                    var targetFile = path.join(targetDir, fileName);
                    //移动文件
                    fs.renameSync(filePath, targetFile);
                    // 文件的Url（相对路径）
                    filesUrl.push(fileName)
                }
            });

            // //存储到数据库中的student
            // student.productUrl = filesUrl[1];
            // student.avatar = filesUrl[0];

            // let studentSchema = new Student({
            //     number: student.number, //编号
            //     name: student.name, //姓名
            //     voteNum: student.voteNum, //票数
            //     productUrl: student.productUrl,
            //     avatar: student.avatar
            // });

            // console.log(studentSchema);

            // // 将学生数据存储在students 集合中
            // studentSchema.save(function(err, doc) {
            //     if (err) {
            //         res.json({
            //             status: "100",
            //             error: '插入失败'
            //         })
            //     } else {
            //         // 返回前台投票成功的信息
            //         res.json({
            //             status: "0",
            //             message: '上传成功',
            //             data: doc
            //         })
            //     }

            // });

            // 返回上传信息
            // res.json({ filesUrl: filesUrl, success: keys.length - errCount, error: errCount });
        });
    }
})


module.exports = router;