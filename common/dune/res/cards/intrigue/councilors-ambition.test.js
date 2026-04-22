'use strict'

const card = require('./councilors-ambition.js')

describe("councilors-ambition", () => {
  test('data', () => {
    expect(card.id).toBe("councilors-ambition")
    expect(card.name).toBe("Councilor's Ambition")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
