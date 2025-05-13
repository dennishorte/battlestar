require('module-alias/register')
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')
const path = require('path')

const config = require('./config')
const middleware = require('#/middleware')
const logger = require('#/utils/logger')
const setupSwagger = require('#/utils/swagger')

// Import routes
const apiRoutes = require('#/routes/api')

// Initialize Express app
const app = express()
const port = config.port || 3000

////////////////////////////////////////////////////////////
// Middleware
app.use(history({ index: '/' }))
app.use(express.static(path.join(__dirname, '../app/dist')))
app.use(middleware.auth.authenticate)
app.use(bodyParser.json({ limit: "500kb" }))
app.use(middleware.validators.ensureVersion)

// Auto-enrich data in request
app.use(middleware.validators.coerceMongoIds)
app.use(middleware.loaders.loadDraftArgs)
app.use(middleware.loaders.loadGameArgs)
app.use(middleware.loaders.loadLobbyArgs)
app.use(middleware.loaders.loadCubeArgs)
app.use(middleware.loaders.loadDeckArgs)
////////////////////////////////////////////////////////////
// API Documentation
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app)
}

////////////////////////////////////////////////////////////
// Routes
app.use('/api', apiRoutes)

// Default error handler
app.use(middleware.errors.errorHandler)

// Function to start the server
const startServer = () => {
  return app.listen(port, () => {
    logger.info(`Server listening on port ${port}`)

  })
}

// Only start the server if this file is run directly (not required/imported)
if (require.main === module) {
  startServer()
}

// For testing purposes
module.exports = { app, startServer }
