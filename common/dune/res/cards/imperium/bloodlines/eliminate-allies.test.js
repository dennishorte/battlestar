'use strict'

const card = require('./eliminate-allies.js')

describe("eliminate-allies", () => {
  test('data', () => {
    expect(card.id).toBe("eliminate-allies")
    expect(card.name).toBe("Eliminate Allies")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
