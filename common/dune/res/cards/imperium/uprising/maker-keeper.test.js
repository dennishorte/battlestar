'use strict'

const card = require('./maker-keeper.js')

describe("maker-keeper", () => {
  test('data', () => {
    expect(card.id).toBe("maker-keeper")
    expect(card.name).toBe("Maker Keeper")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
