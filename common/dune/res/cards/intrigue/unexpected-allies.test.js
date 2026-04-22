'use strict'

const card = require('./unexpected-allies.js')

describe("unexpected-allies", () => {
  test('data', () => {
    expect(card.id).toBe("unexpected-allies")
    expect(card.name).toBe("Unexpected Allies")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
