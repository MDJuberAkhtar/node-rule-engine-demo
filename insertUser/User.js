const usersRef = require('../config/firebase');
// const axios = require('axios');

exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body)

    await usersRef.child(data.name).set({
        name: data.name,
        videowatched: data.video,
        assignment: data.assignment,
        rewardpoint: data.rewardpoint
    })


};
  