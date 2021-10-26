const mysqlconnpool = require('../config/MysqlPool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');
const constants  = require('../config/constant'); 
const Responses = require('../common/API_Responses');

module.exports.handler = async (event) => {
    try {
        const loginData = JSON.parse(event.body);
        const v = new Validator(loginData, {
            email: 'required|email',
            password: 'required'
        })
        const matched = await v.check();

        if (!matched) {
            return Responses._400({message:`Please provide a valid email`})
        }
        const {email, password } = loginData;
    
        let checkQuery = `SELECT *  FROM ${constants.db_name}.vendor WHERE vendoremail= "${email}" `;
        let logdetails = await mysqlconnpool.query(checkQuery);
        if(logdetails.length >0) {
            const passwordResult = await bcrypt.compare(password, logdetails[0].password)
            if(passwordResult) {
                return Responses._200({message:`You are logged in` })
            }
            if(!passwordResult) {
                return Responses._400({message:`Invalid credentials` })
            }
        }else {
            return Responses._400({message:`Invalid credentials` })
        }

    } catch (error) {
        console.log('login::error:', error)
    }
   
};