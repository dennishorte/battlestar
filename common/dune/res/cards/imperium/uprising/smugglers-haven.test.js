'use strict'

const card = require('./smugglers-haven.js')

describe("smugglers-haven", () => {
  test('data', () => {
    expect(card.id).toBe("smugglers-haven")
    expect(card.name).toBe("Smuggler's Haven")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
