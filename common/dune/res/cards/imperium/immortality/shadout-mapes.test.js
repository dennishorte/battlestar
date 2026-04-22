'use strict'

const card = require('./shadout-mapes.js')

describe("shadout-mapes", () => {
  test('data', () => {
    expect(card.id).toBe("shadout-mapes")
    expect(card.name).toBe("Shadout Mapes")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
