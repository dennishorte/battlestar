'use strict'

const card = require('./insider-information.js')

describe("insider-information", () => {
  test('data', () => {
    expect(card.id).toBe("insider-information")
    expect(card.name).toBe("Insider Information")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
