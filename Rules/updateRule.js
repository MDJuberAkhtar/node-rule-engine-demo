const { rulessRef } = require('../config/firebase');
const Responses = require('../common/API_Responses');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    const dataEvent = JSON.parse(event.body);
    let message = {}
    if(dataEvent.name) {
      const dateRef = rulessRef.child(dataEvent.name);
      await dateRef.once('value',(data) => {
        if(data.val()) {
          let newRef = data.val();

          let attributeCheck = newRef['attributes'];
          let decisionsCheck = newRef['decisions'][0];

          if(dataEvent.attributes) {
            attributeCheck = `${dataEvent.attributes}`;
          }
          if(dataEvent.decisions) {
            decisionsCheck = `${dataEvent.decisions}`;
          }

          // console.log('hi saya:', attributeCheck, )
  
          let uppdatedRules = {}
          uppdatedRules.name = dataEvent.name;
          uppdatedRules.attributes = JSON.parse(attributeCheck);
          uppdatedRules.decisions = JSON.parse(decisionsCheck);

          fs.writeFile(path.resolve(`${__dirname}/JsonRuleFiles`, `${dataEvent.name}.json`), JSON.stringify(uppdatedRules), 'utf8', (err => {
            if (err) console.log('Json File Update Error:',err);
            else {
              console.log(`${dataEvent.name} file Updated`);
            }
          }));

          dateRef.update(uppdatedRules);

          message.message = 'loading rule information for "' + dataEvent.name + '"';
          message.data = uppdatedRules

          console.log("Final Message:", message);
        } else {
          message.message = 'Sorry! Given rule name do not exists'
        }
      });

      return Responses._200(message);
    } else {
        
      console.log('missinging Value:', data);

      return Responses._400({message: "Please give the proper rule name"});
    }
    
  } catch (error) {
    console.log('This is Rule Created Error:', error);
    return Responses._400({message: "Please provide proper rule name"});
  }


};