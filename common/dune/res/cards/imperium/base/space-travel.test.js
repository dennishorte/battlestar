'use strict'

const card = require('./space-travel.js')

describe("space-travel", () => {
  test('data', () => {
    expect(card.id).toBe("space-travel")
    expect(card.name).toBe("Space Travel")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
