'use strict'

const card = require('./market-opportunity.js')

describe("market-opportunity", () => {
  test('data', () => {
    expect(card.id).toBe("market-opportunity")
    expect(card.name).toBe("Market Opportunity")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
