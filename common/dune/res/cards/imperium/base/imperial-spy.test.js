'use strict'

const card = require('./imperial-spy.js')

describe("imperial-spy", () => {
  test('data', () => {
    expect(card.id).toBe("imperial-spy")
    expect(card.name).toBe("Imperial Spy")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
