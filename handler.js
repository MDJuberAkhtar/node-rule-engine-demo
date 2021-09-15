'use strict';
const { Engine } = require('json-rules-engine');
require('colors')

module.exports.handler = async (event) => {

  const engine = new Engine()


  engine.addRule({
    conditions: {
      any: [{
        fact: 'videowatched',
        operator: 'greaterThanInclusive',
        value: 1
      }, {
        fact: 'assignment',
        operator: 'greaterThanInclusive',
        value: 1
      }]
    },
    event: { 
      type: 'honor-roll',
      params: {
        message: 'User made the reward points'
      }
    },
    name: 'User Reward Points'
  })

  function render (message, ruleResult) {
    if (ruleResult.result) {
      const detail1 = ruleResult.conditions.any.filter(condition => condition.result === true)
      .map(condition => {
        console.log('this is the condition:', condition.factResult)
        switch (condition.operator) {
          case 'greaterThanInclusive':
            return `${condition.fact} of ${condition.factResult} good`
          default:
            return ''
        }
      }).join(' and ')
     console.log(`${message} ${detail1}`.green)
    }
    const detail = ruleResult.conditions.any.filter(condition => !condition.result)
      .map(condition => {
        switch (condition.operator) {
          case 'greaterThanInclusive':
            return `${condition.fact} of ${condition.factResult} was too low`
          default:
            return ''
        }
      }).join(' and ')
    console.log(`${message} ${detail}`.red)
  }


  engine.on('success', (event, almanac, ruleResult) => {
   
    almanac.factValue('username').then(username => {
      render(`${username.bold} succeeded ${ruleResult.name}! ${event.params.message}`, ruleResult)
    })
  })


  engine.on('failure', (event, almanac, ruleResult) => {
    almanac.factValue('username').then(username => {
      render(`${username.bold} failed ${ruleResult.name} - `, ruleResult)
    })
  })

  await Promise.all([
    // engine.run({ videowatched: 2, assignment: 3, username: 'joe' }),
    // engine.run({ videowatched: 1, assignment: 0, username: 'larry' }),
    // engine.run({ videowatched: 0, assignment: 1, username: 'jane' }),
    // engine.run({ videowatched: 0, assignment: 0, username: 'janet' }),
    // engine.run({ videowatched: 200, assignment: 11, username: 'sarah' }),
    engine.run(event)
  ])
 
};
