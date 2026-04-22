'use strict'

const card = require('./hidden-missive.js')

describe("hidden-missive", () => {
  test('data', () => {
    expect(card.id).toBe("hidden-missive")
    expect(card.name).toBe("Hidden Missive")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
