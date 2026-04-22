'use strict'

const card = require('./guild-accord.js')

describe("guild-accord", () => {
  test('data', () => {
    expect(card.id).toBe("guild-accord")
    expect(card.name).toBe("Guild Accord")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
