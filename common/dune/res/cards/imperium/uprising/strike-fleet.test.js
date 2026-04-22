'use strict'

const card = require('./strike-fleet.js')

describe("strike-fleet", () => {
  test('data', () => {
    expect(card.id).toBe("strike-fleet")
    expect(card.name).toBe("Strike Fleet")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
