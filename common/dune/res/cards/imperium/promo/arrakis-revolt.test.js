'use strict'

const card = require('./arrakis-revolt.js')

describe("arrakis-revolt", () => {
  test('data', () => {
    expect(card.id).toBe("arrakis-revolt")
    expect(card.name).toBe("Arrakis Revolt")
    expect(card.source).toBe("Promo")
    expect(card.compatibility).toBe("Uprising")
  })
})
