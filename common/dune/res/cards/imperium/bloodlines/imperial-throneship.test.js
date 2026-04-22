'use strict'

const card = require('./imperial-throneship.js')

describe("imperial-throneship", () => {
  test('data', () => {
    expect(card.id).toBe("imperial-throneship")
    expect(card.name).toBe("Imperial Throneship")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
