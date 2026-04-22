'use strict'

const card = require('./depart-for-arrakis.js')

describe("depart-for-arrakis", () => {
  test('data', () => {
    expect(card.id).toBe("depart-for-arrakis")
    expect(card.name).toBe("Depart for Arrakis")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
