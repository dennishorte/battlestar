'use strict'

const card = require('./questionable-methods.js')

describe("questionable-methods", () => {
  test('data', () => {
    expect(card.id).toBe("questionable-methods")
    expect(card.name).toBe("Questionable Methods")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
