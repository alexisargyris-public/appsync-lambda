'use strict'

exports.handler = (event, context, callback) => {
  function listBooks() {
    let qr = `
    query {
      listBooks(first: 999) {
        items {
          bookId
        }
      }
    }
    `

    return client.query({ query: gql(qr) }).then(response => {
      let results = []

      response.data.listBooks.items.forEach(element => {
        results.push(element.bookId)
      })
      return results
    })
  }
  function listFilesByBook(bookid) {
    let qr = `
    query {
      listFilesByBook(bookId: "${bookid}") {
        items {
          fileId
        }
      }
    }
    `
    return client.query({ query: gql(qr) }).then(response => {
      let results = []

      response.data.listFilesByBook.items.forEach(element => {
        results.push(element.fileId)
      })
      return results
    })
  }
  function listSessionsByFile(fileid) {
    let qr = `
    query {
      listSessionsByFile(fileId: "${fileid}") {
        items {
          sessionId
        }
      }
    }
    `

    return client.query({ query: gql(qr) }).then(response => {
      let results = []

      response.data.listSessionsByFile.items.forEach(element => {
        results.push(element.sessionId)
      })
      return results
    })
  }
  function listEventsBySession(sessionid) {
    let qr = `
    query {
      listEventsBySession(sessionId: "${sessionid}"){
        items {
          eventId
          content
        }
      }
    }
    `
    return client.query({ query: gql(qr) }).then(response => {
      return response.data.listEventsBySession.items
    })
  }
  let client, gql

  if (event === undefined || event.cmd === undefined || event.cmd === '')
    callback(new Error('Missing cmd parameter'))
  else if (
    event.cmd !== 'books' &&
    event.cmd !== 'sources' &&
    event.cmd !== 'list' &&
    event.cmd !== 'single'
  )
    callback(new Error('Unknown command'))
  else {
    // init api
    const settings = require('./aws-exports.js').settings
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
    const url = settings.ENDPOINT
    const region = settings.REGION
    const type = AUTH_TYPE.AWS_IAM
    const AWS = require('aws-sdk')
    AWS.config.update({
      region: settings.REGION,
      credentials: new AWS.Credentials({
        accessKeyId: settings.AWS_ACCESS_KEY_ID,
        secretAccessKey: settings.AWS_SECRET_ACCESS_KEY
      })
    })
    const credentials = AWS.config.credentials
    gql = require('graphql-tag')
    client = new AWSAppSyncClient({
      url: url,
      region: region,
      auth: {
        type: type,
        credentials: credentials
      },
      disableOffline: true
    })

    // main switch
    switch (event.cmd) {
      // return books
      case 'books':
        listBooks()
          .then(results => {
            callback(null, results)
          })
          .catch(error => {
            callback(error)
          })
        break
      // return the files of a book
      case 'sources':
        if (!event.bookid) {
          callback(new Error('missing bookid parameter'))
        } else {
          listFilesByBook(event.bookid)
            .then(results => {
              callback(null, results)
            })
            .catch(error => {
              callback(error)
            })
        }
        break
      // return the sessions of a file
      case 'list':
        if (!event.fileid) {
          callback(new Error('missing fileid parameter'))
        } else {
          listSessionsByFile(event.fileid)
            .then(results => {
              callback(null, results)
            })
            .catch(error => {
              callback(error)
            })
        }
        break
      // return the events of a session
      case 'single':
        if (!event.sessionid) {
          callback(new Error('missing sessionId parameter'))
        } else {
          listEventsBySession(event.sessionid)
            .then(results => {
              callback(null, results)
            })
            .catch(error => {
              callback(error)
            })
        }
        break
      default:
        break
    }
  }
}

// exports.handler({
//   cmd: 'sources',
// })
