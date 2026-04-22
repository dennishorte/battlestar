'use strict'

const card = require('./rapid-engineering.js')

describe("rapid-engineering", () => {
  test('data', () => {
    expect(card.id).toBe("rapid-engineering")
    expect(card.name).toBe("Rapid Engineering")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
