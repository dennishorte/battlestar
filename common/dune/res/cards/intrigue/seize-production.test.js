'use strict'

const card = require('./seize-production.js')

describe("seize-production", () => {
  test('data', () => {
    expect(card.id).toBe("seize-production")
    expect(card.name).toBe("Seize Production")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
