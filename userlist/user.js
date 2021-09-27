'use strict'
const { usersRef } = require('../config/firebase');


module.exports = {
  getAccountInformation: async (userID) => {
    // return new Promise(async(resolve, reject) => {
      let finalData = {};
      const dateRef = usersRef.child(userID);
      await dateRef.once('value',(data) => {
      let newRef = data.val()
      finalData = JSON.parse(JSON.stringify(newRef));
      // let x = newRef.rewardpoint;
      // finalData.rewardpoint = x+5;
      // dateRef.update({ 'rewardpoint':x+5});
      const message = 'loading account information for "' + newRef.name + '"'
      console.log(message);
      });
      return finalData
    // });
  }
}


