'use strict'

const card = require('./smugglers-thopter.js')

describe("smugglers-thopter", () => {
  test('data', () => {
    expect(card.id).toBe("smugglers-thopter")
    expect(card.name).toBe("Smuggler's Thopter")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
