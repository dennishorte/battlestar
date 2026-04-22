'use strict'

const card = require('./jessica-of-arrakis.js')

describe("jessica-of-arrakis", () => {
  test('data', () => {
    expect(card.id).toBe("jessica-of-arrakis")
    expect(card.name).toBe("Jessica of Arrakis")
    expect(card.source).toBe("Promo")
    expect(card.compatibility).toBe("All")
  })
})
