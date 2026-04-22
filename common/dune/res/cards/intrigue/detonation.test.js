'use strict'

const card = require('./detonation.js')

describe("detonation", () => {
  test('data', () => {
    expect(card.id).toBe("detonation")
    expect(card.name).toBe("Detonation")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
