'use strict';
const { Engine } = require('json-rules-engine');
const { getAccountInformation }= require('./userlist/user');
const Responses = require('./common/API_Responses');

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
        return console.log('Congratulations! you have earned 5 reward points')
      },
      onFailure: function (event, almanac) {
        almanac.addRuntimeFact('trueservice', false)
      }
  }
  
  engine.addRule(acountCheck)
 
    const rewardPointRule = {
      conditions: {
        any: [{
          fact: 'accountInfo',
          path: '$.rewardpoint',
          operator: 'greaterThanInclusive',
          value: 100
        }]
      },
      event: { type: 'this-reward-point' },
      priority: 9 
    }
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
         
         return console.log(`${accountId} ,  have earned total ${parseInt(totalreward/100)} batches and ${parseInt(totalreward%100)} Points`);

        }

      })
      .on('failure', async (event, almanac) => {
        const accountId = await almanac.factValue('accountId')
        const accountInfo1 = await almanac.factValue('accountInfo');
        return console.log(`${accountId} ,  have earned total ${accountInfo1.rewardpoint} points`);
      })
  
  const data = JSON.parse(event.body)
    

  let facts = { accountId: data.name, videoswatched: data.video}
  
  let factResults = await engine.run(facts)
  console.log('thie is fact result:', factResults.almanac.getResults())
 
 
};