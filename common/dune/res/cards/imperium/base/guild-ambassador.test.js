'use strict'

const card = require('./guild-ambassador.js')

describe("guild-ambassador", () => {
  test('data', () => {
    expect(card.id).toBe("guild-ambassador")
    expect(card.name).toBe("Guild Ambassador")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
