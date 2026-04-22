'use strict'

const card = require('./ripples-in-the-sand.js')

describe("ripples-in-the-sand", () => {
  test('data', () => {
    expect(card.id).toBe("ripples-in-the-sand")
    expect(card.name).toBe("Ripples in the Sand")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
