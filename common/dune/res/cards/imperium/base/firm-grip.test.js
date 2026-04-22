'use strict'

const card = require('./firm-grip.js')

describe("firm-grip", () => {
  test('data', () => {
    expect(card.id).toBe("firm-grip")
    expect(card.name).toBe("Firm Grip")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
