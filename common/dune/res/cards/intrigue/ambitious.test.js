'use strict'

const card = require('./ambitious.js')

describe("ambitious", () => {
  test('data', () => {
    expect(card.id).toBe("ambitious")
    expect(card.name).toBe("Ambitious")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
