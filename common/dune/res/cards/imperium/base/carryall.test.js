'use strict'

const card = require('./carryall.js')

describe("carryall", () => {
  test('data', () => {
    expect(card.id).toBe("carryall")
    expect(card.name).toBe("Carryall")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
