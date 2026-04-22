'use strict'

const card = require('./public-spectacle.js')

describe("public-spectacle", () => {
  test('data', () => {
    expect(card.id).toBe("public-spectacle")
    expect(card.name).toBe("Public Spectacle")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
