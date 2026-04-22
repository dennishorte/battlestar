'use strict'

const card = require('./water-of-life.js')

describe("water-of-life", () => {
  test('data', () => {
    expect(card.id).toBe("water-of-life")
    expect(card.name).toBe("Water of Life")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
