'use strict'

const card = require('./discerning.js')

describe("discerning", () => {
  test('data', () => {
    expect(card.id).toBe("discerning")
    expect(card.name).toBe("Discerning")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
