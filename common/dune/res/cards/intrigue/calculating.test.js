'use strict'

const card = require('./calculating.js')

describe("calculating", () => {
  test('data', () => {
    expect(card.id).toBe("calculating")
    expect(card.name).toBe("Calculating")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
