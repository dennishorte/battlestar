'use strict'

const card = require('./imperium-politics.js')

describe("imperium-politics", () => {
  test('data', () => {
    expect(card.id).toBe("imperium-politics")
    expect(card.name).toBe("Imperium Politics")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
