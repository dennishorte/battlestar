'use strict'

const card = require('./undercover-asset.js')

describe("undercover-asset", () => {
  test('data', () => {
    expect(card.id).toBe("undercover-asset")
    expect(card.name).toBe("Undercover Asset")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
