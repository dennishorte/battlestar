'use strict'

const card = require('./backed-by-choam.js')

describe("backed-by-choam", () => {
  test('data', () => {
    expect(card.id).toBe("backed-by-choam")
    expect(card.name).toBe("Backed by CHOAM")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
