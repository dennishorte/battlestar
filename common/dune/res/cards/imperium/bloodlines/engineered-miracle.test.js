'use strict'

const card = require('./engineered-miracle.js')

describe("engineered-miracle", () => {
  test('data', () => {
    expect(card.id).toBe("engineered-miracle")
    expect(card.name).toBe("Engineered Miracle")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
