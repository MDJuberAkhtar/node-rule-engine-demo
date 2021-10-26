const mysqlconnpool = require('../config/MysqlPool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');
const constants  = require('../config/constant'); 
const Responses = require('../common/API_Responses');
const { makeid } = require('../common/generateRandomChar');

const zeroPrefix = (n) => {
    return (n < 10) ? ('0' + n) : n.toString();
};

module.exports.handler = async (event) => {
    try {

        let dates = new Date();
        let today = new Date();
        today.setDate(dates.getDate() - 1);
        const year_today = today.getUTCFullYear();
        const month_today = zeroPrefix(today.getUTCMonth() + 1);
        const day_today = zeroPrefix(today.getUTCDate());
        const hours_today = today.getUTCHours();
        const minutes_today = today.getUTCMinutes();
        const seconds_today = today.getUTCSeconds();
        const begin = `${year_today}-${month_today}-${day_today} ${hours_today}:${minutes_today}:${seconds_today}`

        const signUpData = JSON.parse(event.body);
        const v = new Validator(signUpData, {
            email: 'required|email',
            password: 'required',
            name: 'required'
        })
        const matched = await v.check();

        if (!matched) {
            return Responses._400({message:`Please provide a valid email`})
        }
        const { name, email, password } = signUpData;
        const idvendor = makeid(8);
        const vendorkey = makeid(16);
        const salt = await bcrypt.genSalt(10);
        signUpData.password = await bcrypt.hash(signUpData.password, salt);
        let checkQuery = `SELECT count(*) as Total FROM ${constants.db_name}.vendor WHERE vendoremail= "${email}" `;
        let val = await mysqlconnpool.query(checkQuery);
        if(val[0].Total > 0) return Responses._200({message:'Email already exists! Please login'})
        let query = `INSERT INTO ${constants.db_name}.vendor (idvendor,vendorkey,vendoremail, vendorname, password, created) VALUES('${idvendor}', '${vendorkey}', '${email}', '${name}', '${signUpData.password}', '${begin}')`;
        await mysqlconnpool.query(query);

        return Responses._200({message:'Profile created Successfully'})

    } catch (error) {
        console.log('Signup::error:', error)
    }
   
};