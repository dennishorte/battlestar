'use strict'

const card = require('./maula-pistol.js')

describe("maula-pistol", () => {
  test('data', () => {
    expect(card.id).toBe("maula-pistol")
    expect(card.name).toBe("Maula Pistol")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
