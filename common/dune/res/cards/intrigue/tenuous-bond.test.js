'use strict'

const card = require('./tenuous-bond.js')

describe("tenuous-bond", () => {
  test('data', () => {
    expect(card.id).toBe("tenuous-bond")
    expect(card.name).toBe("Tenuous Bond")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
