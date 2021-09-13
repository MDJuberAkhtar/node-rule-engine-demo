'use strict';
const { Engine } = require('json-rules-engine');

const { getAccountInformation }= require('./userlist/user')

module.exports.handler = async (event) => {

  const engine = new Engine()

  const acountCheck = {
      conditions: {
        all: [{
          fact: 'servicedetails',
          path: '$.service',
          operator: 'equal',
          value: 'kuku tv'
        }]
      },
      event: { type: 'service-check' },
      priority: 10, 
      onSuccess: async function (event, almanac) {
        almanac.addRuntimeFact('trueservice', true)
        const accountId = await almanac.factValue('accountId')
        const accountInfo = await getAccountInformation(accountId)
        almanac.addRuntimeFact('accountInfo', accountInfo)
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
          path: '$.videoswatched',
          operator: 'greaterThanInclusive',
          value: '1'
        },{
          fact: 'accountInfo',
          path: '$.assignment',
          operator: 'greaterThanInclusive',
          value: '1'
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
        let videoreward =  accountInfo.videoswatched ? (accountInfo.videoswatched)*5 : 0;
        let assignmentreward = accountInfo.assignment ? (accountInfo.assignment)*5 : 0;
        let totalreward = videoreward + assignmentreward;
        console.log('totalreward:', totalreward)
        if (totalreward == 2000) {
          console.log(` Congratulations! ${accountId} (${accountInfo.service}),  have won a gift voucher`);
        }
        if ((totalreward % 500) == 0) {
          console.log(` Congratulations! ${accountId} (${accountInfo.service}), you are  eligible for a new kuku voucher`);
        }

        if (totalreward == 1000) {
          console.log(` Congratulations! ${accountId} (${accountInfo.service}),  have unlocked a new avatar`);
        }
        if ((totalreward >= 100) && (totalreward % 100)) {
          console.log(`${accountId} (${accountInfo.service}),  have earned total ${parseInt(totalreward/100)} batches and ${parseInt(totalreward%100)} Points`);
        }
        if (totalreward < 100) {
          console.log(`${accountId} (${accountInfo.service}),  have earned total ${totalreward} points`);
        }

      })
      .on('failure', async (event, almanac) => {
        const accountId = await almanac.factValue('accountId')
        console.log(`${accountId} did ` + 'NOT' + ` meet conditions for the ${event.type.underline} rule.`)
      })
  

  let facts = { accountId: 'samson', servicedetails: "kuku tv", accountInfo: {} }
  
  await engine.run(facts)

 
};
