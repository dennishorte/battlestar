'use strict'

const card = require('./desert-power.js')

describe("desert-power", () => {
  test('data', () => {
    expect(card.id).toBe("desert-power")
    expect(card.name).toBe("Desert Power")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
