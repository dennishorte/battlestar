'use strict'

const card = require('./price-is-not-object.js')

describe("price-is-not-object", () => {
  test('data', () => {
    expect(card.id).toBe("price-is-not-object")
    expect(card.name).toBe("Price is Not Object")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
