'use strict'

const card = require('./coercive-negotiation.js')

describe("coercive-negotiation", () => {
  test('data', () => {
    expect(card.id).toBe("coercive-negotiation")
    expect(card.name).toBe("Coercive Negotiation")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
