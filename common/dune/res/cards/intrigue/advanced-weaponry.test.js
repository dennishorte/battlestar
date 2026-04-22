'use strict'

const card = require('./advanced-weaponry.js')

describe("advanced-weaponry", () => {
  test('data', () => {
    expect(card.id).toBe("advanced-weaponry")
    expect(card.name).toBe("Advanced Weaponry")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
