'use strict'

exports.handler = (event, context, callback) => {
  if (!event || !event.cmd) callback(new Error('Missing cmd parameter'))
  else if (event.cmd !== 'query') callback(new Error('Unknown command'))
  else {
    // init api
    let settings = require('aws-exports.js').settings
    global.WebSocket = require('ws')
    global.window = global.window || {
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      WebSocket: global.WebSocket,
      ArrayBuffer: global.ArrayBuffer,
      addEventListener: function() {},
      navigator: { onLine: true }
    }
    global.localStorage = {
      store: {},
      getItem: function(key) {
        return this.store[key]
      },
      setItem: function(key, value) {
        this.store[key] = value
      },
      removeItem: function(key) {
        delete this.store[key]
      }
    }

    require('es6-promise').polyfill()
    require('isomorphic-fetch')

    const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE
    const AWSAppSyncClient = require('aws-appsync').default
    const url = config.ENDPOINT
    const region = config.REGION
    const type = AUTH_TYPE.AWS_IAM
    const AWS = require('aws-sdk')
    AWS.config.update({
      region: config.REGION,
      credentials: new AWS.Credentials({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
      })
    })
    const credentials = AWS.config.credentials
    this.gql = require('graphql-tag')
    this.client = new AWSAppSyncClient({
      url: url,
      region: region,
      auth: {
        type: type,
        credentials: credentials
      },
      disableOffline: true
    })

    switch (event.cmd) {
      case 'query':
        if (!event.subCmd) callback(new Error('Missing subcmd'))
        else if (event.subCmd !== 'listFiles')
          callback(new Error('Unknown subcmd'))
        else {
          // carry out the query
        }
        break
      case 'mutate':
        break
      default:
        break
    }
  }
}

// exports.handler({
//   cmd: 'query',
//   subCmd: 'listFiles'
// })
