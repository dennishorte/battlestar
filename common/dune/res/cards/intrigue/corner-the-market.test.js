'use strict'

const card = require('./corner-the-market.js')

describe("corner-the-market", () => {
  test('data', () => {
    expect(card.id).toBe("corner-the-market")
    expect(card.name).toBe("Corner The Market")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
