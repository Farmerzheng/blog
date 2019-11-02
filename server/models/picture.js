let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// schema 是用来定义 documents的基本字段和集合的

let pictureSchema = new Schema({
    'title': String,
    'vip': Boolean,
    'type': String,
    'list': Array //图片的路径数组
})

/* 
   Model是操作数据库最直接的一块内容. 我们所有的CRUD就是围绕着Model展开的
   mongoose.model里面定义的第一个参数"article", 并不是数据库中collection的名字， 
   他只是collection的单数形式, 实际上在db中的collection是 "articles"
*/

module.exports = mongoose.model("picture", pictureSchema);