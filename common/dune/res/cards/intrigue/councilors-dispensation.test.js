'use strict'

const card = require('./councilors-dispensation.js')

describe("councilors-dispensation", () => {
  test('data', () => {
    expect(card.id).toBe("councilors-dispensation")
    expect(card.name).toBe("Councilor's Dispensation")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
