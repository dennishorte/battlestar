'use strict'

const card = require('./rebel-supplier.js')

describe("rebel-supplier", () => {
  test('data', () => {
    expect(card.id).toBe("rebel-supplier")
    expect(card.name).toBe("Rebel Supplier")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
