'use strict'

const card = require('./economic-positioning.js')

describe("economic-positioning", () => {
  test('data', () => {
    expect(card.id).toBe("economic-positioning")
    expect(card.name).toBe("Economic Positioning")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
