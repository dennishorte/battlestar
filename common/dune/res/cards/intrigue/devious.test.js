'use strict'

const card = require('./devious.js')

describe("devious", () => {
  test('data', () => {
    expect(card.id).toBe("devious")
    expect(card.name).toBe("Devious")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
