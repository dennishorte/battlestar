'use strict'

const card = require('./quash-rebellion.js')

describe("quash-rebellion", () => {
  test('data', () => {
    expect(card.id).toBe("quash-rebellion")
    expect(card.name).toBe("Quash Rebellion")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Bloodlines")
  })
})
