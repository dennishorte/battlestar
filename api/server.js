require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')

const middleware = require('./src/middleware.js')
const routes = require('./src/routes.js')

const app = express()
const port = 3000


////////////////////////////////////////////////////////////
// Middleware


app.use(express.static(path.join(__dirname, '../app/dist')))
app.use(middleware.authenticate)
app.use(bodyParser.json())
app.use(middleware.coerceIds)


////////////////////////////////////////////////////////////
// Routes

// Guest routes
app.get('/', routes.sendVueApp)
app.post('/api/guest/login', routes.login)

// Lobby Routes
app.post('/api/lobby/all', routes.lobby.all)
app.post('/api/lobby/create', routes.lobby.create)
app.post('/api/lobby/info', routes.lobby.info)

// User Routes
app.post('/api/user/all', routes.user.all)
app.post('/api/user/create', routes.user.create)
app.post('/api/user/deactivate', routes.user.deactivate)
app.post('/api/user/fetch_many', routes.user.fetchMany)


////////////////////////////////////////////////////////////
// Initialize

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`)
})
