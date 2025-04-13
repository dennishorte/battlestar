const auth = require('./auth')
const validation = require('./validation')
const dataLoader = require('./data-loader')
const errorHandler = require('./error-handler')

module.exports = {
  authenticate: auth.authenticate,
  coerceMongoIds: validation.coerceMongoIds,
  ensureVersion: validation.ensureVersion,
  loadDraftArgs: dataLoader.loadDraftArgs,
  loadGameArgs: dataLoader.loadGameArgs,
  loadLobbyArgs: dataLoader.loadLobbyArgs,
  errorHandler
}; 