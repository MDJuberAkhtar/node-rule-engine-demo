'use strict';
const { Engine } = require('json-rules-engine');
const { getAccountInformation }= require('../userlist/user');
const Responses = require('../common/API_Responses');
const fs = require("fs");
const { rulessRef } = require('../config/firebase');
const path = require('path');

module.exports.handler = async (event) => {

  const data = JSON.parse(event.body)

  const engine = new Engine()

  const acountCheck = {
      conditions: {
        all: [{
          fact: 'videoswatched',
          path: '$.videoswatched',
          operator: 'greaterThanInclusive',
          value: 80
        }]
      },
      event: { type: 'video-watched' },
      priority: 10, 
      onSuccess: async function (event, almanac) {
        const accountId = await almanac.factValue('accountId')
        const accountInfo = await getAccountInformation(accountId)
        almanac.addRuntimeFact(`${data.factName}`, accountInfo)
        return console.log('Congratulations! you have earned 5 reward points')
      },
      onFailure: function (event, almanac) {
        almanac.addRuntimeFact('trueservice', false)
      }
  }
  engine.addRule(acountCheck);

  let finalData = {};
  if(data.factName) {
    const dateRef = rulessRef.child(data.factName);
    await dateRef.once('value',(data) => {
      if(data.val()) {
        let newRef = data.val();
        finalData = JSON.parse(JSON.stringify(newRef));
      } 
    });

  }


//   console.log('this is reward rule:', finalData)

    engine.addRule(finalData)
  
    engine
      .on('success', async (event, almanac) => {
        const accountInfo = await almanac.factValue(`${data.factName}`);
        const accountId = await almanac.factValue('accountId');
        let totalreward = accountInfo.rewardpoint ? (accountInfo.rewardpoint) : 0;
        console.log('totalreward:', totalreward)
        
        if (totalreward == 2000) {
          return console.log(` Congratulations! ${accountId} ,  have won a gift voucher`);
        }
        if ((totalreward % 500) == 0 && (totalreward !== 1000)) {
          return console.log(` Congratulations! ${accountId} , you are  eligible for a new kuku voucher`);
        }

        if (totalreward == 1000) {
          return console.log(` Congratulations! ${accountId} ,  have unlocked a new avatar and also won a new kuku vaoucher`);
        }

        if ((totalreward >= 100) && (totalreward % 100)) {
          let string = `${accountId} ,  have earned total ${parseInt(totalreward/100)} batches and ${parseInt(totalreward%100)} Points`
          console.log(string);
          return string;

        }

      })
      .on('failure', async (event, almanac) => {
        const accountId = await almanac.factValue('accountId')
        const accountInfo1 = await almanac.factValue(`${data.factName}`);
        return console.log(`${accountId} ,  have earned total ${accountInfo1.rewardpoint} points`);
      })
  

    

  let facts = { accountId: data.name, videoswatched: data.video, factname : data.factName}
  
  let factResults = await engine.run(facts);
  let ruleResults = factResults['almanac']['ruleResults'];
  console.log('this is reult:', ruleResults)
 

  if(ruleResults[1].result) {
    let rewardMessage = ruleResults[1].event.params.message
    let trueResults = ruleResults[1].conditions.all.filter(condition => condition.result)
    .map(condition => condition)
    // console.log('this is true:', rewardMessage)
    let message = {}
    message.message = "Congratulations! you have earned 5 reward points"
    message.rewardpoint = trueResults[0].factResult
    message.rewardmessage = rewardMessage
    return Responses._200(message);
    

  }else if(!ruleResults[1].result) {
    let falseResults = ruleResults[1].conditions.all.filter(condition => !condition.result)
    .map(condition =>condition.factResult)
    let message = {}
    message.message = "Congratulations! you have earned 5 reward points fail"
    message.rewardpoint = falseResults[0]
    return Responses._200(message);
  }
 
};