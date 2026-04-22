'use strict'

const card = require('./chani-clever-tactician.js')

describe("chani-clever-tactician", () => {
  test('data', () => {
    expect(card.id).toBe("chani-clever-tactician")
    expect(card.name).toBe("Chani, Clever Tactician")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
