'use strict'

const card = require('./infiltrate.js')

describe("infiltrate", () => {
  test('data', () => {
    expect(card.id).toBe("infiltrate")
    expect(card.name).toBe("Infiltrate")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
