'use strict'

const card = require('./smugglers-harvester.js')

describe("smugglers-harvester", () => {
  test('data', () => {
    expect(card.id).toBe("smugglers-harvester")
    expect(card.name).toBe("Smuggler's Harvester")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
