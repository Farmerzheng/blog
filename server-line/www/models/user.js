let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// schema 是用来定义 documents的基本字段和集合的

let userSchema = new Schema({
    tel: String,
    pictureList: Array,
    vip: String,
    expirationTime: Number,
    nickname: String,
    gender: String,
    province: String,
    city: String,
    year: String,
    constellation: String,
    figureurl: String,
    qqOpenid: String, //qq登录用户唯一标识
    browsedPictures: Number,
    out_trade_no: String //订单号
})

/* 
   Model是操作数据库最直接的一块内容. 我们所有的CRUD就是围绕着Model展开的
   mongoose.model里面定义的第一个参数"user", 并不是数据库中collection的名字， 
   他只是collection的单数形式, 实际上在db中的collection是"users"
*/

module.exports = mongoose.model("user", userSchema);