'use strict'

const card = require('./choam-shares.js')

describe("choam-shares", () => {
  test('data', () => {
    expect(card.id).toBe("choam-shares")
    expect(card.name).toBe("Choam Shares")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
