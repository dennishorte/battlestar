'use strict'

const card = require('./in-high-places.js')

describe("in-high-places", () => {
  test('data', () => {
    expect(card.id).toBe("in-high-places")
    expect(card.name).toBe("In High Places")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
