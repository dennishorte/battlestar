'use strict'

const card = require('./the-strong-survive.js')

describe("the-strong-survive", () => {
  test('data', () => {
    expect(card.id).toBe("the-strong-survive")
    expect(card.name).toBe("The Strong Survive")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
