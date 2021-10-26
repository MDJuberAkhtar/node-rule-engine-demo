const { rulessRef } = require('../config/firebase');
const Responses = require('../common/API_Responses');
const fs = require('fs');
const path = require('path');

//*******************Rule Creation**************************************/
  // console.log('this is type:', AllRule)

  // let rawdata = fs.readFileSync(path.resolve(`${__dirname}/../temp`, `${data.rule}.json`));
  // let decisionData = JSON.parse(rawdata);
  // let arrtibuteData = decisionData['attributes'];
  // let factNameData = arrtibuteData.map(name => name.name);
  
  // fs.writeFile(path.resolve(`${__dirname}/../temp`, `${name}.json`), JSON.stringify(newRules), 'utf8', (err => {
  //   if (err) console.log('Json File Creation Error:',err);
  //   else {
  //     console.log(`${name} file created`);
  //   }
  // }));
//*********************************************************/


exports.handler = async (event) => {
  try {
    const dataEvent = JSON.parse(event.body);
    let messageData = {}

    let { name, attributes, decisions} = dataEvent;

    if( name && attributes && decisions) {
      const dataRef = rulessRef.child(name);
      await dataRef.once('value',(data) => {
        if(!data.val()) {
          let newRules = dataEvent
          messageData.message = 'Rule creation has been Successfull!'
          console.log('new rules:', newRules);
          rulessRef.child(name).set(newRules);

        } else {

          messageData.message = 'Rule Already exists!'
          
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
  