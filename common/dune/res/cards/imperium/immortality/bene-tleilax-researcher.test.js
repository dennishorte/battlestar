'use strict'

const card = require('./bene-tleilax-researcher.js')

describe("bene-tleilax-researcher", () => {
  test('data', () => {
    expect(card.id).toBe("bene-tleilax-researcher")
    expect(card.name).toBe("Bene Tleilax Researcher")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
