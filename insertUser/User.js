const usersRef = require('../config/firebase');
// const axios = require('axios');

exports.handler = async (event, context, callback) => {
    console.log('this is :', usersRef)
    const data = JSON.parse(event.body)

    // console.log('the events:', event, data)
    // const user_id = usersRef.push().key;
//    console.log('id:', user_id)
    await usersRef.child(data.name).set({
        name: data.name,
        videowatched: data.video,
        assignment: data.assignment,
        rewardpoint: data.rewardpoint
    })


};
  