'use strict'

const card = require('./guild-spy.js')

describe("guild-spy", () => {
  test('data', () => {
    expect(card.id).toBe("guild-spy")
    expect(card.name).toBe("Guild Spy")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
