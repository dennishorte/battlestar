'use strict'

const card = require('./corrinth-city.js')

describe("corrinth-city", () => {
  test('data', () => {
    expect(card.id).toBe("corrinth-city")
    expect(card.name).toBe("Corrinth City")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
