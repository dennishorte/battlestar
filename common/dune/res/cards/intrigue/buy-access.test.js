'use strict'

const card = require('./buy-access.js')

describe("buy-access", () => {
  test('data', () => {
    expect(card.id).toBe("buy-access")
    expect(card.name).toBe("Buy Access")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
