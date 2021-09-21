const { rulessRef } = require('../config/firebase');
const Responses = require('../common/API_Responses');

exports.handler = async (event, context, callback) => {
  try {
    const dataEvent = JSON.parse(event.body);
    let message = {}
    if(dataEvent.id) {
      const dateRef = rulessRef.child(dataEvent.id);
      await dateRef.once('value',(data) => {
        if(data.val()) {
          let newRef = data.val();

          let conditionCheck = newRef["conditions"]["all"][0];
          let factNameCheck = conditionCheck["fact"];
          let pathCheck = conditionCheck["path"];
          let operatorCheck = conditionCheck["operator"];
          let valueCheck = conditionCheck["value"];
          let eventNameCheck = newRef["event"]["type"];
          let messageCheck = newRef["event"]["params"]["message"];
          let priorityCheck = newRef["priority"];
  
          let uppdatedRules = {
             "conditions":{ 
               "all": [{
                "fact": `${dataEvent.factName ? dataEvent.factName : factNameCheck}`,
               //   "path": `$.${data.targetfield ? data.targetfield : pathCheck}`,
               "operator": `${dataEvent.operator ? dataEvent.operator : operatorCheck}`,
               "value": dataEvent.value ? dataEvent.value : valueCheck
              }]
            },
            "event": { 
             "type": `${dataEvent.eventName ? dataEvent.eventName : eventNameCheck}`,
             "params": {
             "message": `${dataEvent.message ? dataEvent.message : messageCheck}`
            }
           },
           "priority": dataEvent.priority ? dataEvent.priority : priorityCheck
          }

           dateRef.update(uppdatedRules);

          message.message = 'loading account information for "' + dataEvent.id + '"';
          message.data = uppdatedRules

          console.log("Final Message:", message);
        } else {
          message.message = 'Sorry! Given Rule id do not exists'
        }
      });

      return Responses._200(message);
    } else {
        
      console.log('missinging Value:', data);

      return Responses._400({message: "Please give the proper rule id"});
    }
    
  } catch (error) {
    console.log('This is Rule Created Error:', error);
    return Responses._400({message: "Please provide proper rule id"});
  }


};