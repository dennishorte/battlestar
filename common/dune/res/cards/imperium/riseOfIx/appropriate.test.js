'use strict'

const card = require('./appropriate.js')

describe("appropriate", () => {
  test('data', () => {
    expect(card.id).toBe("appropriate")
    expect(card.name).toBe("Appropriate")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("Shipping (Rise of Ix)")
  })
})
