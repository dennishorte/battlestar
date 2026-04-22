'use strict'

const card = require('./guild-bankers.js')

describe("guild-bankers", () => {
  test('data', () => {
    expect(card.id).toBe("guild-bankers")
    expect(card.name).toBe("Guild Bankers")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
