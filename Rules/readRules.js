const { rulessRef } = require('../config/firebase');
const Responses = require('../common/API_Responses');

exports.handler = async (event, context, callback) => {
  try {
    let finalData = {};
    await rulessRef.once('value',(data) => {
    let newRef = data.val()
    finalData = JSON.parse(JSON.stringify(newRef));
 
    });
    console.log('this is type:', finalData)
    return Responses._200(finalData);
    
  } catch (error) {
    console.log('This is Rule Created Error:', error);
    return Responses._400({message: "Something went wrong! Please try againg"});
  }


};
  