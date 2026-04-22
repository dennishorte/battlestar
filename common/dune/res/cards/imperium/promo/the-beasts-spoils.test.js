'use strict'

const card = require('./the-beasts-spoils.js')

describe("the-beasts-spoils", () => {
  test('data', () => {
    expect(card.id).toBe("the-beasts-spoils")
    expect(card.name).toBe("The Beast's Spoils")
    expect(card.source).toBe("Promo")
    expect(card.compatibility).toBe("Uprising")
  })
})
