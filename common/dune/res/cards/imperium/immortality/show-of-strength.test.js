'use strict'

const card = require('./show-of-strength.js')

describe("show-of-strength", () => {
  test('data', () => {
    expect(card.id).toBe("show-of-strength")
    expect(card.name).toBe("Show of Strength")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
