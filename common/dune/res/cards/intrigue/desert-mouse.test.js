'use strict'

const card = require('./desert-mouse.js')

describe("desert-mouse", () => {
  test('data', () => {
    expect(card.id).toBe("desert-mouse")
    expect(card.name).toBe("Desert Mouse")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
