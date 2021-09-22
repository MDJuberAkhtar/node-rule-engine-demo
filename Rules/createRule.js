const { rulessRef } = require('../config/firebase');
const Responses = require('../common/API_Responses');

exports.handler = async (event, context, callback) => {
  try {
    const dataEvent = JSON.parse(event.body);
    let messageData = {}

    let { factName, targetfield, operator, value, eventName, message} = dataEvent;

    if(factName && targetfield && operator && value && eventName && message) {
      const dataRef = rulessRef.child(factName);
      await dataRef.once('value',(data) => {
        if(!data.val()) {
          let newRules = {
            "conditions":{ 
                "all": [{
                  "fact": `${factName}`,
                  "path": `$.${targetfield}`,
                  "operator": `${operator}`,
                  "value": value
                  }]
              },
            "event": { 
              "type": `${eventName}`,
              "params": {
                "message": `${message}`
              }
            },
            "priority": dataEvent.priority ? dataEvent.priority : 1
           }
          messageData.message = 'Rule creation has been Successfull!'
          console.log('new rules:', newRules);

          rulessRef.child(factName).set(newRules);

        } else {

          messageData.message = 'fact Already exists!'
          
        }
      });

      return Responses._200(messageData); 
      
    } else {

      console.log('MIssing Value:', data);
      return Responses._400({message: "Please fill up all the values"});
    }
    
  } catch (error) {
    console.log('This is Rule Created Error:', error);
    return Responses._400({message: "Something went wrong! Please try againg"});
  }


};
  