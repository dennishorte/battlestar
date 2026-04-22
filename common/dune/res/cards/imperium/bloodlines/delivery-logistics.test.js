'use strict'

const card = require('./delivery-logistics.js')

describe("delivery-logistics", () => {
  test('data', () => {
    expect(card.id).toBe("delivery-logistics")
    expect(card.name).toBe("Delivery Logistics")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
