'use strict'

const card = require('./sleeper-unit.js')

describe("sleeper-unit", () => {
  test('data', () => {
    expect(card.id).toBe("sleeper-unit")
    expect(card.name).toBe("Sleeper Unit")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
