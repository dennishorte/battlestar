'use strict'

const card = require('./scout.js')

describe("scout", () => {
  test('data', () => {
    expect(card.id).toBe("scout")
    expect(card.name).toBe("Scout")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
