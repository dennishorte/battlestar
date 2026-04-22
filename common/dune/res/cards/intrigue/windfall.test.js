'use strict'

const card = require('./windfall.js')

describe("windfall", () => {
  test('data', () => {
    expect(card.id).toBe("windfall")
    expect(card.name).toBe("Windfall")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
