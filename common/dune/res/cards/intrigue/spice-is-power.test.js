'use strict'

const card = require('./spice-is-power.js')

describe("spice-is-power", () => {
  test('data', () => {
    expect(card.id).toBe("spice-is-power")
    expect(card.name).toBe("Spice is Power")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
