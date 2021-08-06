const db = require('./models/db.js')


async function createFirstUserIfNone(name, password) {
  if (await db.user.isEmpty()) {
    console.log('User db is empty. Creating first user.')
    const user = await db.user.create(
      name,
      password,
      null,
    )
  }
}


module.exports.login = async function(req, res) {
  await createFirstUserIfNone(req.body.name, req.body.password)

  try {
    const user = await db.user.checkPassword(req.body.name, req.body.password)
    res.json({ token: user.token })
  }
  catch (err) {
    res.json({ error: err })
  }
}
