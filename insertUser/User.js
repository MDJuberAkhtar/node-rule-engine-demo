const { usersRef } = require('../config/firebase');
// const axios = require('axios');

exports.handler = async (event) => {
    const data = JSON.parse(event.body)

    await usersRef.child(data.name).set({
        name: data.name,
        videowatched: data.videowatched,
        achivements: data.achivements,
        rewardpoint: data.rewardpoint
    })


};
  