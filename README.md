# appsync-lambda

a simple wrapper of aws appsync for aws lambda

# release notes

## 1.0.0

The function names were selected to be compatible with those of [evernote-lambda](https://github.com/alexisargyris/evernote-lambda) and [github-lambda](https://github.com/alexisargyris/github-lambda) repos.

- books(): returns all books
- sources(bookId): returns all files of book
- list(fileId): returns all sessions of file
- single(sessionId): returns all events of session
