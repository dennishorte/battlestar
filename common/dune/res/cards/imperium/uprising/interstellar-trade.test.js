'use strict'

const card = require('./interstellar-trade.js')

describe("interstellar-trade", () => {
  test('data', () => {
    expect(card.id).toBe("interstellar-trade")
    expect(card.name).toBe("Interstellar Trade")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
