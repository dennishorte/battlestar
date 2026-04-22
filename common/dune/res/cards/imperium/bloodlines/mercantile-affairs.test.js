'use strict'

const card = require('./mercantile-affairs.js')

describe("mercantile-affairs", () => {
  test('data', () => {
    expect(card.id).toBe("mercantile-affairs")
    expect(card.name).toBe("Mercantile Affairs")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
