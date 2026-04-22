'use strict'

const card = require('./tiebreaker.js')

describe("tiebreaker", () => {
  test('data', () => {
    expect(card.id).toBe("tiebreaker")
    expect(card.name).toBe("Tiebreaker")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
