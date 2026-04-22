'use strict'

const card = require('./freighter-fleet.js')

describe("freighter-fleet", () => {
  test('data', () => {
    expect(card.id).toBe("freighter-fleet")
    expect(card.name).toBe("Freighter Fleet")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("Shipping (Rise of Ix)")
  })
})
