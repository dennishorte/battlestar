'use strict'

const card = require('./delivery-agreement.js')

describe("delivery-agreement", () => {
  test('data', () => {
    expect(card.id).toBe("delivery-agreement")
    expect(card.name).toBe("Delivery Agreement")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
