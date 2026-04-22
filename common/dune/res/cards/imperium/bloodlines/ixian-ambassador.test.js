'use strict'

const card = require('./ixian-ambassador.js')

describe("ixian-ambassador", () => {
  test('data', () => {
    expect(card.id).toBe("ixian-ambassador")
    expect(card.name).toBe("Ixian Ambassador")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
