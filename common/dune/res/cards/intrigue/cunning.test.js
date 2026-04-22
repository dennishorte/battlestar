'use strict'

const card = require('./cunning.js')

describe("cunning", () => {
  test('data', () => {
    expect(card.id).toBe("cunning")
    expect(card.name).toBe("Cunning")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
