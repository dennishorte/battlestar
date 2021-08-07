const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { user_db } = require('../util/mongo.js')
const ObjectId = require('mongodb').ObjectId

const dbUsers = user_db.collection('user')


const User = {}  // This will be the exported module

User.all = async function() {
  const filter = {
    deactivated: { $exists: false }
  }
  const projection = {
    name: 1,
    slack: 1,
  }
  return dbUsers.find(filter).project(projection).toArray()
}

User.checkPassword = async function(name, password) {
  const user = await User.findByName(name)

  if (!user) {
    throw `User not found (${name})`
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatches) {
    throw `Invalid password for user (${name})`
  }

  return user
}

User.isEmpty = async function() {
  try {
    const one = await dbUsers.findOne({})
    return !one
  }
  catch (err) {
    console.log(err)
  }
}

User.create = async function({ name, password, slack }) {
  const existingUser = await User.findByName(name)
  if (!!existingUser) {
    throw `User with name (${name}) already exists`
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const insertResult = await dbUsers.insertOne({
    name,
    slack,
    passwordHash,
  })
  const { insertedId } = insertResult

  if (!insertedId) {
    throw 'User insert failed'
  }

  User.setTokenForUserById(insertedId)

  return await User.findById(insertedId)
}

User.findById = async function(id) {
  const oid = new ObjectId(id)
  return await dbUsers.findOne({ _id: oid })
}

User.findByName = async function(name) {
  return await dbUsers.findOne({ name })
}

User.setTokenForUserById = async function(object_id) {
  const filter = { _id: object_id }
  const updater = { $set: { token: User.util.generateToken(object_id) } }
  const result = await dbUsers.updateOne(filter, updater)
}


////////////////////////////////////////////////////////////
// User.util

User.util = {}

User.util.generateToken = function(id) {
  if (typeof id === 'object') {  // Probably a mongodb ObjectId
    id = id.toString()
  }

  return jwt.sign({ user_id: id }, process.env.SECRET_KEY)
}


////////////////////////////////////////////////////////////
// Exports

module.exports = User
