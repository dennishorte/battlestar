'use strict'

const card = require('./quid-pro-quo.js')

describe("quid-pro-quo", () => {
  test('data', () => {
    expect(card.id).toBe("quid-pro-quo")
    expect(card.name).toBe("Quid Pro Quo")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
