'use strict'

const card = require('./water-peddlers-union.js')

describe("water-peddlers-union", () => {
  test('data', () => {
    expect(card.id).toBe("water-peddlers-union")
    expect(card.name).toBe("Water Peddlers Union")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
