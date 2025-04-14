require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')
const path = require('path')

const config = require('./config')
const middleware = require('./src/middleware')
const logger = require('./src/utils/logger')
const setupSwagger = require('./src/utils/swagger')

// Import routes
const apiRoutes = require('./src/routes/api')

// Initialize Express app
const app = express()
const port = config.port || 3000

////////////////////////////////////////////////////////////
// Middleware
app.use(history({ index: '/' }))
app.use(express.static(path.join(__dirname, '../app/dist')))
app.use(middleware.authenticate)
app.use(bodyParser.json({ limit: "500kb" }))
app.use(middleware.ensureVersion)

// Auto-enrich data in request
app.use(middleware.coerceMongoIds)
app.use(middleware.loadDraftArgs)
app.use(middleware.loadGameArgs)
app.use(middleware.loadLobbyArgs)

////////////////////////////////////////////////////////////
// API Documentation
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app)
}

////////////////////////////////////////////////////////////
// Routes
app.use('/api', apiRoutes)

// Default error handler
app.use(middleware.errorHandler)

////////////////////////////////////////////////////////////
// Initialize
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`)
})

const { listRoutes } = require('./src/util/debug')
const routes = listRoutes(app)
for (const elem of routes) {
  console.log(elem)
}

// For testing purposes
module.exports = app;
