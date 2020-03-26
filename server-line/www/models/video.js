let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// schema 是用来定义 documents的基本字段和集合的

let videoSchema = new Schema({
    'title': String, //视频标题
    'time': String, //视频上传时间
    'url': String, //视频地址
    'videoCover': String //视频封面
})

/* 
   Model是操作数据库最直接的一块内容. 我们所有的CRUD就是围绕着Model展开的
   mongoose.model里面定义的第一个参数"article", 并不是数据库中collection的名字， 
   他只是collection的单数形式, 实际上在db中的collection是 "articles"
*/

module.exports = mongoose.model("video", videoSchema);