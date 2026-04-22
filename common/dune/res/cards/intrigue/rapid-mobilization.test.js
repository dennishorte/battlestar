'use strict'

const card = require('./rapid-mobilization.js')

describe("rapid-mobilization", () => {
  test('data', () => {
    expect(card.id).toBe("rapid-mobilization")
    expect(card.name).toBe("Rapid Mobilization")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
