'use strict'

const card = require('./tactical-option.js')

describe("tactical-option", () => {
  test('data', () => {
    expect(card.id).toBe("tactical-option")
    expect(card.name).toBe("Tactical Option")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
