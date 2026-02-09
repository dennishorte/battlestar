import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { client as databaseClient } from '../utils/mongo.js'
const database = databaseClient.db('games')
const userCollection = database.collection('user')


const User = {}  // This will be the exported module

User.all = async function(projection) {
  const filter = {
    deactivated: { $exists: false }
  }

  if (!projection) {
    projection = {
      name: 1,
      slack: 1,
      lastSeen: 1,
    }
  }

  return userCollection.find(filter).project(projection).toArray()
}

User.checkPassword = async function(name, password) {
  const user = await User.findByName(name)

  if (!user) {
    console.log(`User not found: ${user}`)
    return null
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatches) {
    console.log(`Passwords do not match`)
    return null
  }

  return user
}

User.allDeactivated = async function(projection) {
  const filter = {
    deactivated: true
  }

  if (!projection) {
    projection = {
      name: 1,
      slack: 1,
      lastSeen: 1,
    }
  }

  return userCollection.find(filter).project(projection).toArray()
}

User.deactivate = async function(id) {
  const filter = { _id: id }
  const updater = { $set: { deactivated: true } }
  return await userCollection.updateOne(filter, updater)
}

User.reactivate = async function(id) {
  const filter = { _id: id }
  const updater = { $unset: { deactivated: 1 } }
  return await userCollection.updateOne(filter, updater)
}

User.isEmpty = async function() {
  try {
    const one = await userCollection.findOne({})
    return !one
  }
  catch (err) {
    console.log(err)
  }
}

User.create = async function({ name, password, slack }) {
  const existingUser = await User.findByName(name)
  if (existingUser) {
    throw `User with name (${name}) already exists`
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const insertResult = await userCollection.insertOne({
    name,
    slack,
    passwordHash,
    createdTimestamp: Date.now(),
  })
  const { insertedId } = insertResult

  if (!insertedId) {
    throw 'User insert failed'
  }

  User.setTokenForUserById(insertedId)

  return await User.findById(insertedId)
}

User.findById = async function(id) {
  return await userCollection.findOne({ _id: id })
}

User.findByIds = async function(ids) {
  return await userCollection.find({ _id: { $in: ids } })
}

User.findByName = async function(name) {
  return await userCollection.findOne({ name })
}

User.setTokenForUserById = async function(object_id) {
  const filter = { _id: object_id }
  const updater = { $set: { token: User.util.generateToken(object_id) } }
  return await userCollection.updateOne(filter, updater)
}

User.updateLastSeen = function(id) {
  userCollection.updateOne({ _id: id }, { $set: { lastSeen: new Date() } })
}

User.update = async function({ userId, name, slack }) {
  const filter = { _id: userId }
  const updater = { $set: {
    name: name,
    slack: slack,
  }}
  return await userCollection.updateOne(filter, updater)
}

// Impersonation methods
User.startImpersonation = async function(adminId, targetUserId) {
  const admin = await User.findById(adminId)
  const targetUser = await User.findById(targetUserId)

  if (!admin) {
    throw new Error('Admin user not found')
  }

  if (!targetUser) {
    throw new Error('Target user not found')
  }

  if (targetUser.deactivated) {
    throw new Error('Cannot impersonate deactivated user')
  }

  // Check if admin is authorized (hardcoded check for now)
  if (admin.name !== 'dennis') {
    throw new Error('Only admin users can impersonate')
  }

  // Check if target user is already being impersonated
  if (targetUser.impersonatedBy) {
    const impersonatingAdmin = await User.findById(targetUser.impersonatedBy)
    const adminName = impersonatingAdmin ? impersonatingAdmin.name : 'Unknown'
    throw new Error(`User is already being impersonated by ${adminName}. Please clear the impersonation first.`)
  }

  // Generate impersonation token
  const impersonationToken = User.util.generateImpersonationToken(adminId, targetUserId)

  // Update target user with impersonation data
  const filter = { _id: targetUserId }
  const updater = {
    $set: {
      impersonatedBy: adminId,
      impersonationToken: impersonationToken,
      originalAdminId: adminId,
      impersonationStartTime: new Date()
    }
  }

  await userCollection.updateOne(filter, updater)

  return {
    impersonationToken,
    targetUser: {
      _id: targetUser._id,
      name: targetUser.name,
      slack: targetUser.slack
    },
    adminUser: {
      _id: admin._id,
      name: admin.name
    }
  }
}

User.stopImpersonation = async function(impersonationToken) {
  // Find user by impersonation token
  const user = await User.findByImpersonationToken(impersonationToken)

  if (!user) {
    throw new Error('Invalid impersonation token')
  }

  // Clear impersonation data
  const filter = { _id: user._id }
  const updater = {
    $unset: {
      impersonatedBy: 1,
      impersonationToken: 1,
      originalAdminId: 1,
      impersonationStartTime: 1
    }
  }

  await userCollection.updateOne(filter, updater)

  return {
    message: 'Impersonation stopped successfully',
    originalAdminId: user.originalAdminId
  }
}

User.findByImpersonationToken = async function(token) {
  return await userCollection.findOne({ impersonationToken: token })
}

User.getImpersonationStatus = async function(userId) {
  const user = await User.findById(userId)

  if (!user) {
    return null
  }

  if (user.impersonatedBy) {
    const adminUser = await User.findById(user.impersonatedBy)
    return {
      isImpersonated: true,
      impersonatedBy: {
        _id: adminUser._id,
        name: adminUser.name
      },
      impersonationStartTime: user.impersonationStartTime
    }
  }

  return {
    isImpersonated: false
  }
}

User.clearImpersonation = async function(targetUserId) {
  const user = await User.findById(targetUserId)

  if (!user) {
    throw new Error('Target user not found')
  }

  if (!user.impersonatedBy) {
    throw new Error('User is not being impersonated')
  }

  // Clear impersonation data
  const filter = { _id: targetUserId }
  const updater = {
    $unset: {
      impersonatedBy: 1,
      impersonationToken: 1,
      originalAdminId: 1,
      impersonationStartTime: 1
    }
  }

  await userCollection.updateOne(filter, updater)

  return {
    message: 'Impersonation cleared successfully',
    targetUserId: user._id,
    targetUserName: user.name
  }
}

User.clearAllImpersonations = async function() {
  // Find all users with impersonation data
  const usersWithImpersonation = await userCollection.find({
    impersonatedBy: { $exists: true }
  }).toArray()

  if (usersWithImpersonation.length === 0) {
    return {
      message: 'No users are currently being impersonated',
      clearedCount: 0
    }
  }

  // Clear impersonation data for all users
  const result = await userCollection.updateMany(
    { impersonatedBy: { $exists: true } },
    {
      $unset: {
        impersonatedBy: 1,
        impersonationToken: 1,
        originalAdminId: 1,
        impersonationStartTime: 1
      }
    }
  )

  return {
    message: 'All impersonations cleared successfully',
    clearedCount: result.modifiedCount,
    totalFound: usersWithImpersonation.length
  }
}

User.isAdmin = async function(userId) {
  const user = await User.findById(userId)
  return user ? user.name === 'dennis' : false
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

User.util.generateImpersonationToken = function(adminId, targetUserId) {
  if (typeof adminId === 'object') {
    adminId = adminId.toString()
  }
  if (typeof targetUserId === 'object') {
    targetUserId = targetUserId.toString()
  }

  return jwt.sign({
    user_id: targetUserId,
    impersonation: true,
    admin_id: adminId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
  }, process.env.SECRET_KEY)
}

export default User
