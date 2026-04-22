'use strict'

const card = require('./false-orders.js')

describe("false-orders", () => {
  test('data', () => {
    expect(card.id).toBe("false-orders")
    expect(card.name).toBe("False Orders")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
