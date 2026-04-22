'use strict'

const card = require('./demand-respect.js')

describe("demand-respect", () => {
  test('data', () => {
    expect(card.id).toBe("demand-respect")
    expect(card.name).toBe("Demand Respect")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
