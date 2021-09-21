const { rulessRef } = require('../config/firebase');
const Responses = require('../common/API_Responses');

exports.handler = async (event, context, callback) => {
  try {
    const dataEvent = JSON.parse(event.body);
    let messageData = {}

    let { id } = dataEvent;

    if(id) {
      const dataRef = rulessRef.child(id);
      await dataRef.once('value',(data) => {
        if(data.val()) {

         rulessRef.child(id).remove();

         messageData.message = 'Data has been deleted SUccesfully!'

        } else {

          messageData.message = 'Id do not exits '
          
        }
      });

      return Responses._200(messageData); 
      
    } else {

      console.log('MIssing Value:', data);
      return Responses._400({message: "Please provide an id"});
    }
    
  } catch (error) {
    console.log('This is Rule Created Error:', error);
    return Responses._400({message: "Please provide an id"});
  }


};