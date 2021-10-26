const { rulessRef } = require('../config/firebase');
const Responses = require('../common/API_Responses');
const fs = require('fs');
const path = require('path');



exports.handler = async (event, context, callback) => {
  try {
    const dataEvent = JSON.parse(event.body);
    let messageData = {}

    let { rulename } = dataEvent;

    if(rulename) {
      const dataRef = rulessRef.child(rulename);
      await dataRef.once('value',(data) => {
        if(data.val()) {

         rulessRef.child(rulename).remove();

         fs.unlink(path.resolve(`${__dirname}/JsonRuleFiles`, `${rulename}.json`), (err => {
          if (err) console.log(err);
          else {
            console.log(`Deleted ${rulename} file`);
          }
         }));
         
         messageData.message = 'Data has been deleted SUccesfully!'

        } else {

          messageData.message = 'rule do not exits '
          
        }
      });

      return Responses._200(messageData); 
      
    } else {

      console.log('MIssing Value:', data);
      return Responses._400({message: "Please provide an fact"});
    }
    
  } catch (error) {
    console.log('This is Rule Created Error:', error);
    return Responses._400({message: "Please provide an fact"});
  }


};