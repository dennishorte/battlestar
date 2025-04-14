const { ObjectId } = require('mongodb')

// In-memory user store
const users = {}
const games = {}
const lobbies = {}

// User model mock
const user = {
  all: jest.fn(async () => Object.values(users)),
  
  checkPassword: jest.fn(async (name, password) => {
    const user = Object.values(users).find(u => u.name === name)
    // In a real implementation, we'd compare hashed passwords
    // For testing, just check if password is 'password'
    if (user && password === 'password') {
      return user
    }
    return null
  }),
  
  create: jest.fn(async (userData) => {
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
  
  findById: jest.fn(async (id) => {
    return users[id] || null
  }),
  
  findByName: jest.fn(async (name) => {
    return Object.values(users).find(u => u.name === name) || null
  }),
  
  update: jest.fn(async (userData) => {
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
  create: jest.fn(async (gameData) => {
    const id = new ObjectId()
    const newGame = {
      _id: id,
      createdTimestamp: Date.now(),
      ...gameData
    }
    games[id] = newGame
    return newGame
  }),
  
  find: jest.fn(async () => ({
    toArray: async () => Object.values(games)
  })),
  
  findById: jest.fn(async (id) => {
    return games[id] || null
  })
}

// Lobby model mock
const lobby = {
  create: jest.fn(async (lobbyData) => {
    const id = new ObjectId()
    const newLobby = {
      _id: id,
      createdTimestamp: Date.now(),
      ...lobbyData
    }
    lobbies[id] = newLobby
    return newLobby
  }),
  
  find: jest.fn(async () => ({
    toArray: async () => Object.values(lobbies)
  })),
  
  findById: jest.fn(async (id) => {
    return lobbies[id] || null
  })
}

// Utility to clear all data
const clearAll = () => {
  Object.keys(users).forEach(key => delete users[key])
  Object.keys(games).forEach(key => delete games[key])
  Object.keys(lobbies).forEach(key => delete lobbies[key])
}

module.exports = {
  user,
  game,
  lobby,
  clearAll
} 
