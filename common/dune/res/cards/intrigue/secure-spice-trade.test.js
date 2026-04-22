'use strict'

const card = require('./secure-spice-trade.js')

describe("secure-spice-trade", () => {
  test('data', () => {
    expect(card.id).toBe("secure-spice-trade")
    expect(card.name).toBe("Secure Spice Trade")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
