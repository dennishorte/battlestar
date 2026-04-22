'use strict'

const card = require('./weirding-combat.js')

describe("weirding-combat", () => {
  test('data', () => {
    expect(card.id).toBe("weirding-combat")
    expect(card.name).toBe("Weirding Combat")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
