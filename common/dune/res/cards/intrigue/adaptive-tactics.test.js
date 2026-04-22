'use strict'

const card = require('./adaptive-tactics.js')

describe("adaptive-tactics", () => {
  test('data', () => {
    expect(card.id).toBe("adaptive-tactics")
    expect(card.name).toBe("Adaptive Tactics")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
