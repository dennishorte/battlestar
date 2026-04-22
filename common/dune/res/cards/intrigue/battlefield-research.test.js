'use strict'

const card = require('./battlefield-research.js')

describe("battlefield-research", () => {
  test('data', () => {
    expect(card.id).toBe("battlefield-research")
    expect(card.name).toBe("Battlefield Research")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
