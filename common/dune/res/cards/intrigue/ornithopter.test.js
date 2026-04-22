'use strict'

const card = require('./ornithopter.js')

describe("ornithopter", () => {
  test('data', () => {
    expect(card.id).toBe("ornithopter")
    expect(card.name).toBe("Ornithopter")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
