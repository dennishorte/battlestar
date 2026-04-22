'use strict'

const card = require('./leadership.js')

describe("leadership", () => {
  test('data', () => {
    expect(card.id).toBe("leadership")
    expect(card.name).toBe("Leadership")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
