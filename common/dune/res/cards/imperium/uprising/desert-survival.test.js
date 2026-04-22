'use strict'

const card = require('./desert-survival.js')

describe("desert-survival", () => {
  test('data', () => {
    expect(card.id).toBe("desert-survival")
    expect(card.name).toBe("Desert Survival")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
