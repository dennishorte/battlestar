import crypto from 'crypto'
import { client as databaseClient } from '../utils/mongo.js'

const database = databaseClient.db('games')
const inviteCollection = database.collection('invite')

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000

const Invite = {}

Invite.generateToken = function() {
  return crypto.randomBytes(24).toString('hex')
}

Invite.create = async function({ username, createdBy }) {
  const now = Date.now()
  const doc = {
    token: Invite.generateToken(),
    username,
    createdBy,
    createdAt: now,
    expiresAt: now + INVITE_TTL_MS,
  }
  await inviteCollection.insertOne(doc)
  return doc
}

Invite.findByToken = async function(token) {
  return await inviteCollection.findOne({ token })
}

Invite.markUsed = async function(token) {
  return await inviteCollection.updateOne(
    { token },
    { $set: { usedAt: Date.now() } }
  )
}

Invite.listActive = async function() {
  const now = Date.now()
  return await inviteCollection
    .find({ usedAt: { $exists: false }, expiresAt: { $gt: now } })
    .sort({ createdAt: -1 })
    .toArray()
}

export default Invite
