'use strict'

const card = require('./reinforcements.js')

describe("reinforcements", () => {
  test('data', () => {
    expect(card.id).toBe("reinforcements")
    expect(card.name).toBe("Reinforcements")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
