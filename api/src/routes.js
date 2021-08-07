const db = require('./models/db.js')


async function createFirstUserIfNone(name, password) {
  if (await db.user.isEmpty()) {
    console.log('User db is empty. Creating first user.')
    const user = await db.user.create({
      name,
      password,
      slack: null,
    })
  }
}


module.exports.login = async function(req, res) {
  await createFirstUserIfNone(req.body.name, req.body.password)
  const user = await db.user.checkPassword(req.body.name, req.body.password)

  if (user.deactivated) {
    res.json({
      status: 'error',
      message: `User (${req.body.name}) has been deactivated`,
    })
    return
  }
  else {
    res.json({
      status: 'success',
      token: user.token,
    })
    return
  }
}


module.exports.user = {}

module.exports.user.all = async function(req, res) {
  const users = await db.user.all()
  res.json({
    status: 'success',
    users
  })
}

module.exports.user.create = async function(req, res) {
  const user = await db.user.create({
    name: req.body.name,
    password: req.body.password,
    slack: req.body.slack,
  })

  res.json({
    status: 'success',
    message: 'User created',
  })
}

module.exports.user.deactivate = async function(req, res) {
  const user = db.user.findByName(req.body.name)

  if (!user) {
    res.json({
      status: 'error',
      message: 'user not found',
    })
  }

  else {
    const filter = { _id: user._id }
    const updater = { $set: { deactivated: true } }
    const result = await dbUsers.updateOne(filter, updater)

  }
}
