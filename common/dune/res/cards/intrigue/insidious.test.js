'use strict'

const card = require('./insidious.js')

describe("insidious", () => {
  test('data', () => {
    expect(card.id).toBe("insidious")
    expect(card.name).toBe("Insidious")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
