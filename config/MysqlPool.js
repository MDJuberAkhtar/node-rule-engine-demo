const constants = require('./constant');

let db_config = {};
db_config.host = constants.db_host;
db_config.user = constants.db_username;
db_config.password = constants.db_password;
db_config.connectionLimit = 2;
db_config.multipleStatements = true;
console.log('MysqlServerless:db_config',db_config);

let mysqlconnpool = require('serverless-mysql')({backoff:'decorrelated',base:5,cap:200,config:db_config});
module.exports = mysqlconnpool;