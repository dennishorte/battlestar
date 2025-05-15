import { ObjectId } from 'mongodb'
import { vi } from 'vitest'

// In-memory user store
const users = {}
const games = {}
const lobbies = {}

// User model mock
const user = {
  all: vi.fn().mockResolvedValue([
    { _id: 'user1', name: 'User One' },
    { _id: 'user2', name: 'User Two' }
  ]),

  checkPassword: vi.fn(async (name, password) => {
    const user = Object.values(users).find(u => u.name === name)
    // In a real implementation, we'd compare hashed passwords
    // For testing, just check if password is 'password'
    if (user && password === 'password') {
      return user
    }
    return null
  }),

  create: vi.fn().mockResolvedValue({ _id: 'new-user-id', name: 'New User' }),

  findById: vi.fn().mockResolvedValue({ _id: 'user1', name: 'User One' }),

  findByIds: vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'user1', name: 'User One' },
      { _id: 'user2', name: 'User Two' }
    ])
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
  }),

  deactivate: vi.fn().mockResolvedValue({ modifiedCount: 1 })
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

  find: vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'game1', name: 'Game One', waiting: ['User One'] },
      { _id: 'game2', name: 'Game Two', waiting: ['User Two'] }
    ])
  }),

  findById: vi.fn(async (id) => {
    return games[id] || null
  }),

  findByUserId: vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'game1', name: 'Game One', waiting: ['User One'] }
    ])
  }),

  findRecentlyFinishedByUserId: vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'game3', name: 'Game Three', gameOver: true }
    ])
  }),

  save: vi.fn(),
  gameOver: vi.fn()
}

// Lobby model mock
const lobby = {
  all: vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'lobby1', name: 'Lobby One', users: [] },
      { _id: 'lobby2', name: 'Lobby Two', users: [] }
    ])
  }),

  create: vi.fn().mockResolvedValue('new-lobby-id'),

  find: vi.fn(async () => ({
    toArray: async () => Object.values(lobbies)
  })),

  findById: vi.fn().mockResolvedValue({
    _id: 'new-lobby-id',
    users: []
  }),

  findByUserId: vi.fn().mockReturnValue({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'lobby1', name: 'Lobby One' },
      { _id: 'lobby2', name: 'Lobby Two' }
    ])
  }),

  save: vi.fn().mockResolvedValue(true),

  kill: vi.fn().mockResolvedValue(true)
}

// Misc model mock
const misc = {
  appVersion: vi.fn().mockResolvedValue('1.0.0')
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
  misc,
  clearAll
}
