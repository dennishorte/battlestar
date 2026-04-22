'use strict'

const card = require('./imperial-spymaster.js')

describe("imperial-spymaster", () => {
  test('data', () => {
    expect(card.id).toBe("imperial-spymaster")
    expect(card.name).toBe("Imperial Spymaster")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
