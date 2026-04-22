'use strict'

const card = require('./arrakis-observer.js')

describe("arrakis-observer", () => {
  test('data', () => {
    expect(card.id).toBe("arrakis-observer")
    expect(card.name).toBe("Arrakis Observer")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
