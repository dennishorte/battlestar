'use strict'

const card = require('./opportunism.js')

describe("opportunism", () => {
  test('data', () => {
    expect(card.id).toBe("opportunism")
    expect(card.name).toBe("Opportunism")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
