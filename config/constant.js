exports.db_host = process.env.VSMS_DB_HOST || 'localhost';
exports.db_username = process.env.DB_USERNMAE || 'root';
exports.db_password = process.env.DB_PASSWD || 'Juber123@99';
exports.db_name = process.env.DB_NAME || 'vboxlite_db';

//Redis Related
exports.RedisHost = process.env.REDIS_HOST || 'localhost';
exports.RedisPort = process.env.REDIS_PORT || 6379;
exports.RedisPasswd = process.env.REDIS_PASSWORD || '';

//Expiry Related
exports.providerDetailsExpiry = process.env.providerDetailsExpiry || 3600*24*7;

