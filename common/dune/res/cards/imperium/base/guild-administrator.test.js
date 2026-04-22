'use strict'

const card = require('./guild-administrator.js')

describe("guild-administrator", () => {
  test('data', () => {
    expect(card.id).toBe("guild-administrator")
    expect(card.name).toBe("Guild Administrator")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
