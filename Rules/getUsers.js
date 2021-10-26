'use strict';
const { Engine } = require('json-rules-engine');
const { getAccountInformation }= require('../userlist/user');
const Responses = require('../common/API_Responses');
const fs = require("fs");
const { rulessRef } = require('../config/firebase');
const { usersRef } = require('../config/firebase');
const path = require('path');

module.exports.handler = async (event) => {

  const data = JSON.parse(event.body);
  let finalData = {};
    await rulessRef.once('value',(data) => {
    let newRef = data.val()
    finalData = JSON.parse(JSON.stringify(newRef));
 
  });

  let AllRule = Object.keys(finalData)
 
  const accountInfo = await getAccountInformation(data.name);
  let achivedRules = accountInfo.achivements;
  let uncheckRules = [];
  let uncheckFacts = [];
  let rewardPointRule = [];

  for (let i = 0; i< AllRule.length; i++) {
   if(achivedRules.includes(AllRule[i])) {
     console.log('Rules Already Present:',  AllRule[i])
   } else{
    uncheckRules.push(AllRule[i]);
    let uncheckedarrtibuteData = finalData[AllRule[i]]['attributes'];
    rewardPointRule.push(finalData[AllRule[i]]['decisions'][0])
    uncheckFacts.push(uncheckedarrtibuteData.map(name => name.name));
    }
  }

  let factNameData = Array.prototype.concat.apply([], uncheckFacts);
  
  // console.log('account info:', uncheckRules, factNameData, rewardPointRule)

  const engine = new Engine();

  const acountCheck = {
      conditions: {
        all: [{
          fact: 'accountId',
          operator: 'equal',
          value: data.name
        }]
      },
      event: { type: 'eligblity' },
      priority: 10, 
      onSuccess: async function (event, almanac) {
        const accountId = await almanac.factValue('accountId');

        factNameData.forEach(element => {
          almanac.addRuntimeFact(`${element}`, accountInfo);
        });

        return console.log('Congratulations! you have earned 5 reward points');
      },
      onFailure: function (event, almanac) {
        factNameData.forEach(element => {
          almanac.addRuntimeFact(`${element}`, accountInfo);
        });
        return console.log('Sorry! You have already claimed the reward');
      }
  }
  engine.addRule(acountCheck);


  rewardPointRule.forEach(val=>{
    engine.addRule(val)
  });
  
  let facts = { accountId: data.name}
  
  let factResults = await engine.run(facts);
  let ruleResults = factResults['almanac']['ruleResults'];

  console.log('this is result:', ruleResults)

  if(ruleResults[0].result) {
 
    for(let i = 1; i<ruleResults.length; i++) {

      if(ruleResults[i].result) {
        // console.log('this is uncked:', uncheckRules[i-1])

        const dateRef = usersRef.child(data.name);
        await dateRef.once('value', async() => {

         const newAchivement = accountInfo.achivements.push(uncheckRules[i-1]);
         console.log('this is x',accountInfo.achivements, newAchivement);
        //  await dateRef.update({ 'achivements': accountInfo.achivements});
        });
  
       let rewardMessage = ruleResults[i].event.type
       let message = {}
       message.rewardmessage = rewardMessage
       return Responses._200(message);

      } 
    }

    for(let i = 1; i<ruleResults.length; i++) {

      if(!(ruleResults[i].result)) {
        let message = {}
        message.message = "Sorry! You are not elegible for any reward at the moment";
        return Responses._200(message);

      } 

    }
  } else {
  
    let message = {}
    message.message = "Sorry! You are not elegible for any reward at the moment";
    return Responses._200(message);
  }
 
};