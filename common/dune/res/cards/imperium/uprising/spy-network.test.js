'use strict'

const card = require('./spy-network.js')

describe("spy-network", () => {
  test('data', () => {
    expect(card.id).toBe("spy-network")
    expect(card.name).toBe("Spy Network")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
