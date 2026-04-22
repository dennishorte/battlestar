'use strict'

const card = require('./bene-tleilax-lab.js')

describe("bene-tleilax-lab", () => {
  test('data', () => {
    expect(card.id).toBe("bene-tleilax-lab")
    expect(card.name).toBe("Bene Tleilax Lab")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
