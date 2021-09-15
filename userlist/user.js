'use strict'

const userData = {
  washington: {
    username: 'washington',
    service: 'kuku tv',
    videoswatched: 85,
    rewardpoint: 100,
    assignment: 1,
    createdAt: '2012-02-14'
  },
  jefferson: {
    username: 'jefferson',
    service: 'kuku tv',
    videoswatched: 95,
    rewardpoint: 200,
    assignment: 3,
    createdAt: '2012-02-14'
  },
  lincoln: {
    username: 'lincoln',
    service: 'kuku tv',
    videoswatched: 95,
    rewardpoint: 500,
    assignment: 5,
    createdAt: '2012-02-14'
  }
  ,
  abraham: {
    username: 'abraham',
    service: 'kuku tv',
    videoswatched: 35,
    rewardpoint: 1000,
    assignment: 7,
    createdAt: '2012-02-14'
  },
  samson: {
    username: 'samson',
    service: 'kuku tv',
    videoswatched: 80,
    assignment: 0,
    rewardpoint: 1000,
    createdAt: '2012-02-14'
  }
}

module.exports = {
  getAccountInformation: (userID) => {
    const message = 'loading account information for "' + userID + '"'
    console.log(message)
    return new Promise((resolve, reject) => {
      setImmediate(() => {
        resolve(userData[userID])
      })
    })
  }
}
