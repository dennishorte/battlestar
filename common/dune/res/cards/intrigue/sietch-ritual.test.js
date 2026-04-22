'use strict'

const card = require('./sietch-ritual.js')

describe("sietch-ritual", () => {
  test('data', () => {
    expect(card.id).toBe("sietch-ritual")
    expect(card.name).toBe("Sietch Ritual")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
