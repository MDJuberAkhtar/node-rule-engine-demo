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

  let rawdata = fs.readFileSync(path.resolve(`${__dirname}/JsonRuleFiles`, `${data.rule}.json`));
  let decisionData = JSON.parse(rawdata);
  let arrtibuteData = decisionData['attributes'];
  let factNameData = arrtibuteData.map(name => name.name);
  const accountInfo = await getAccountInformation(data.name);
  
  // console.log('account info:', accountInfo.achivements)

  const engine = new Engine();

  const acountCheck = {
      conditions: {
        all: [{
          fact: 'rulename',
          operator: 'notIn',
          value: accountInfo.achivements
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

  let rewardPointRule = decisionData["decisions"][0];

  // console.log('this is reward:', rewardPointRule)


  engine.addRule(rewardPointRule)
  
    engine
      .on('success', async (event, almanac) => {
        console.log('success:')

      })
      .on('failure', async (event, almanac) => {
        console.log('fail')
    })
  
  let facts = { accountId: data.name,  rulename : data.rule}
  
  let factResults = await engine.run(facts);

  let ruleResults = factResults['almanac']['ruleResults'];

  if(ruleResults[0].result) {
    if(ruleResults[1].result) {

      const dateRef = usersRef.child(data.name);
        await dateRef.once('value', async() => {
        const newAchivement = accountInfo.achivements.push(data.rule);
        // console.log('this is x',accountInfo.achivements, newAchivement);
        await dateRef.update({ 'achivements': accountInfo.achivements});

      });
  
      let rewardMessage = ruleResults[1].event.params.message
      let message = {}
      message.rewardmessage = rewardMessage
      return Responses._200(message);
    }
    else if(!ruleResults[1].result) {
  
      let message = {}
      message.message = "Sorry! You are not elegible for the reward";
      return Responses._200(message);
  
    }
  } 

  if(!(ruleResults[0].result)) {

    let message = {}
    message.message = "Sorry! You have already claimed the reward";
    return Responses._200(message);

  }
 
};