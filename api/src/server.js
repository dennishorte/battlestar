// Import dependencies
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import history from 'connect-history-api-fallback'
import path from 'path'
import { fileURLToPath } from 'url'

// Import local modules
import config from '#/config'
import middleware from '#/middleware'
import logger from '#/utils/logger'
import setupSwagger from '#/utils/swagger'

// Import routes
import apiRoutes from '#/routes/api'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Express app
const app = express()
const port = config.port || 3000

////////////////////////////////////////////////////////////
// Middleware
app.use(history({ index: '/' }))
app.use(express.static(path.join(__dirname, '../../app/dist')))
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
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer()
}

// For testing purposes
export { app, startServer }
