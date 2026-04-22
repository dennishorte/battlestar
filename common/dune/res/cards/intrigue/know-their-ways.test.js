'use strict'

const card = require('./know-their-ways.js')

describe("know-their-ways", () => {
  test('data', () => {
    expect(card.id).toBe("know-their-ways")
    expect(card.name).toBe("Know Their Ways")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
