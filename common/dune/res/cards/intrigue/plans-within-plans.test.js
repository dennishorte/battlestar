'use strict'

const card = require('./plans-within-plans.js')

describe("plans-within-plans", () => {
  test('data', () => {
    expect(card.id).toBe("plans-within-plans")
    expect(card.name).toBe("Plans Within Plans")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
