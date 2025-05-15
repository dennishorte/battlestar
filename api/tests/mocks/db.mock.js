import { ObjectId } from 'mongodb'
import { vi } from 'vitest'

// In-memory user store
const users = {}
const games = {}
const lobbies = {}

// User model mock
const user = {
  all: vi.fn(async () => Object.values(users)),

  checkPassword: vi.fn(async (name, password) => {
    const user = Object.values(users).find(u => u.name === name)
    // In a real implementation, we'd compare hashed passwords
    // For testing, just check if password is 'password'
    if (user && password === 'password') {
      return user
    }
    return null
  }),

  create: vi.fn(async (userData) => {
    const id = new ObjectId()
    const newUser = {
      _id: id,
      name: userData.name,
      passwordHash: 'hashedPassword', // Would be bcrypt.hash(password) in real implementation
      ...userData,
      createdTimestamp: Date.now()
    }
    users[id] = newUser
    return newUser
  }),

  findById: vi.fn(async (id) => {
    return users[id] || null
  }),

  findByIds: vi.fn(async (ids) => {
    return {
      toArray: async () => ids.map(id => users[id] || null).filter(Boolean)
    }
  }),

  findByName: vi.fn(async (name) => {
    return Object.values(users).find(u => u.name === name) || null
  }),

  update: vi.fn(async (userData) => {
    const user = users[userData.userId]
    if (user) {
      users[userData.userId] = {
        ...user,
        name: userData.name,
        slack: userData.slack
      }
      return { modifiedCount: 1 }
    }
    return { modifiedCount: 0 }
  })
}

// Game model mock
const game = {
  all: vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'game1', name: 'Test Game 1' },
      { _id: 'game2', name: 'Test Game 2' }
    ])
  }),

  create: vi.fn(async (gameData) => {
    const id = new ObjectId()
    const newGame = {
      _id: id,
      createdTimestamp: Date.now(),
      ...gameData
    }
    games[id] = newGame
    return newGame
  }),

  find: vi.fn(async () => ({
    toArray: async () => Object.values(games)
  })),

  findById: vi.fn(async (id) => {
    return games[id] || null
  }),

  save: vi.fn(),
  gameOver: vi.fn()
}

// Lobby model mock
const lobby = {
  create: vi.fn(async (lobbyData) => {
    const id = new ObjectId()
    const newLobby = {
      _id: id,
      createdTimestamp: Date.now(),
      ...lobbyData
    }
    lobbies[id] = newLobby
    return newLobby
  }),

  find: vi.fn(async () => ({
    toArray: async () => Object.values(lobbies)
  })),

  findById: vi.fn(async (id) => {
    return lobbies[id] || null
  })
}

// Utility to clear all data
const clearAll = () => {
  Object.keys(users).forEach(key => delete users[key])
  Object.keys(games).forEach(key => delete games[key])
  Object.keys(lobbies).forEach(key => delete lobbies[key])
}

export default {
  user,
  game,
  lobby,
  clearAll
}
