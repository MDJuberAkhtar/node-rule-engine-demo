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
          let finalData = {}
          let newRef = data.val();
          finalData = JSON.parse(JSON.stringify(newRef))
          let attributeCheck = finalData['attributes'];
          let decisionsCheck = finalData['decisions'][0];

          // console.log('this is arrti:', attributeCheck, decisionsCheck)

          if(dataEvent.attributes) {
            attributeCheck = dataEvent.attributes;
          }
          if(dataEvent.decisions) {
            decisionsCheck = dataEvent.decisions[0];
          }
  
          let uppdatedRules = {}
          uppdatedRules.name = dataEvent.name;
          uppdatedRules.attributes = attributeCheck;
          uppdatedRules.decisions = decisionsCheck;

          // console.log('hi sam:', uppdatedRules)

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