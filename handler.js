const Responses = require('./common/API_Responses');
const axios = require('axios');


const rewardApiCall = async (user) => {
    console.log('this is user:', user);
    const axiosConfig = {};
    axiosConfig.method = "post";
    axiosConfig.url="https://5ukolg5z29.execute-api.ap-south-1.amazonaws.com/dev/get-rule-user";
    axiosConfig.headers={"Content-Type": "application/json"};
    axiosConfig.data = JSON.stringify({name: `${user}`});
    return new Promise( (resolve, reject) => {
        axios(axiosConfig).then(function(response) {
          if (response.data.errorcode) {
            console.log("error:", response.data.errorcode);
          }
          return resolve(response);
        }).catch((err) => {
          console.log(err);
        });
    });
  
}

module.exports.handler = async(event) =>{
    const data = JSON.parse(event.body);
    const userid = data.name
    const newdata = await rewardApiCall(userid);
    console.log('new message:', newdata.data.rewardmessage);
    const messagedata = newdata.data.rewardmessage ? newdata.data.rewardmessage : newdata.data.message
    return Responses._200({message:`${messagedata}`})
}