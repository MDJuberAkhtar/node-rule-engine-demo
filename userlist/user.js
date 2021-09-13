'use strict'

const userData = {
  washington: {
    service: 'kuku tv',
    videoswatched: 5,
    assignment: 1,
    createdAt: '2012-02-14'
  },
  jefferson: {
    service: 'kuku tv',
    videoswatched: 15,
    assignment: 3,
    createdAt: '2012-02-14'
  },
  lincoln: {
    service: 'kuku tv',
    videoswatched: 25,
    assignment: 5,
    createdAt: '2012-02-14'
  }
  ,
  abraham: {
    service: 'kuku tv',
    videoswatched: 35,
    assignment: 7,
    createdAt: '2012-02-14'
  },
  samson: {
    service: 'kuku tv',
    videoswatched: 400,
    assignment: 0,
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
