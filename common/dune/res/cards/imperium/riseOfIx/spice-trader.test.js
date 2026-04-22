'use strict'

const card = require('./spice-trader.js')

describe("spice-trader", () => {
  test('data', () => {
    expect(card.id).toBe("spice-trader")
    expect(card.name).toBe("Spice Trader")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
