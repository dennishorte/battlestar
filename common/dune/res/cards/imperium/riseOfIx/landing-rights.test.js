'use strict'

const card = require('./landing-rights.js')

describe("landing-rights", () => {
  test('data', () => {
    expect(card.id).toBe("landing-rights")
    expect(card.name).toBe("Landing Rights")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("Shipping (Rise of Ix)")
  })
})
