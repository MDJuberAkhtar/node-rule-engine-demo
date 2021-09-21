'use strict';
const { Engine } = require('json-rules-engine');
const { getAccountInformation }= require('./userlist/user');
const Responses = require('./common/API_Responses');
const fs = require("fs");
const path = require('path');

module.exports.handler = async (event) => {

  const engine = new Engine()

  const acountCheck = {
      conditions: {
        any: [{
          fact: 'videoswatched',
          path: '$.videoswatched',
          operator: 'greaterThanInclusive',
          value: 80
        }]
      },
      event: { type: 'video-watched' },
      priority: 10, 
      onSuccess: async function (event, almanac) {
        almanac.addRuntimeFact('trueservice', true)
        const accountId = await almanac.factValue('accountId')
        const accountInfo = await getAccountInformation(accountId)
        almanac.addRuntimeFact('accountInfo', accountInfo)
        almanac.addRuntimeFact('giftInfo', accountInfo)
        almanac.addRuntimeFact('valucherInfo', accountInfo)
        almanac.addRuntimeFact('bacthInfo', accountInfo)
        almanac.addRuntimeFact('avatarInfo', accountInfo)
        return console.log('Congratulations! you have earned 5 reward points')
      },
      onFailure: function (event, almanac) {
        almanac.addRuntimeFact('trueservice', false)
      }
  }
  engine.addRule(acountCheck);

  let rawdata = fs.readFileSync(path.resolve(__dirname, 'rules.json'));
  let rewardPointRule = JSON.parse(rawdata);

  // console.log('this is reward rule:', rewardPointRule)

    engine.addRule(rewardPointRule)
  
    engine
      .on('success', async (event, almanac) => {
        const accountInfo = await almanac.factValue('accountInfo');
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
        const accountInfo1 = await almanac.factValue('accountInfo');
        return console.log(`${accountId} ,  have earned total ${accountInfo1.rewardpoint} points`);
      })
  
  const data = JSON.parse(event.body)
    

  let facts = { accountId: data.name, videoswatched: data.video}
  
  let factResults = await engine.run(facts);
  let ruleResults = factResults['almanac']['ruleResults'];

  if(ruleResults[1].result) {
    let trueResults = ruleResults[1].conditions.any.filter(condition => condition.result)
    .map(condition => condition)
    // console.log('this is true:',trueResults[0])
    let message = {}
    message.message = "Congratulations! you have earned 5 reward points"
    message.rewardpoint = trueResults[0].factResult
    // let message = trueResults[0].body
    if(trueResults[0].fact == 'giftInfo'){
      message.giftinfo = 'Congratulations! You have won a Gift Voucher'
      return Responses._200(message);
    }
    if(trueResults[0].fact == 'avatarInfo'){
      message.giftinfo = 'Congratulations! You have won a Kuku Voucher and Unlocked a new Avatar'
      return Responses._200(message);
    }
    if(trueResults[0].fact == 'valucherInfo'){
      message.giftinfo = 'Congratulations! You have won a Kuku Voucher'
      return Responses._200(message);
    }
    if(trueResults[0].fact == 'bacthInfo'){
      message.giftinfo = 'Congratulations! You have earned a new Batch'
      return Responses._200(message);
    }

  }else if(!ruleResults[1].result) {
    let falseResults = ruleResults[1].conditions.any.filter(condition => !condition.result)
    .map(condition =>condition.factResult)
    let message = {}
    message.message = "Congratulations! you have earned 5 reward points"
    message.rewardpoint = falseResults[0]
    return Responses._200(message);
  }
 
};