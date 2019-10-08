var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
// 设置数据库名，数据库地址，数据库端口
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAUL_PORT), {
    safe: true
});