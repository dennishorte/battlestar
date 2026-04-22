'use strict'

const card = require('./disruption-tactics.js')

describe("disruption-tactics", () => {
  test('data', () => {
    expect(card.id).toBe("disruption-tactics")
    expect(card.name).toBe("Disruption Tactics")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
