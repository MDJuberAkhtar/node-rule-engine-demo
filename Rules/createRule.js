const { rulessRef } = require('../config/firebase');
const Responses = require('../common/API_Responses');

exports.handler = async (event, context, callback) => {
  try {
    const dataEvent = JSON.parse(event.body);
    let messageData = {}

    let { factName, targetfield, operator, value, eventName, message, priority, id} = dataEvent;

    if(factName && targetfield && operator && value && eventName && message && priority && id) {
      const dataRef = rulessRef.child(id);
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
            "priority": priority
           }
          messageData.message = 'Rule creation has been Successfull!'
          console.log('new rules:', newRules);

          rulessRef.child(id).set(newRules);

        } else {

          messageData.message = 'Rule id Already exists!'
          
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
  