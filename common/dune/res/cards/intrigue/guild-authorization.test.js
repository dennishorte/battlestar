'use strict'

const card = require('./guild-authorization.js')

describe("guild-authorization", () => {
  test('data', () => {
    expect(card.id).toBe("guild-authorization")
    expect(card.name).toBe("Guild Authorization")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
