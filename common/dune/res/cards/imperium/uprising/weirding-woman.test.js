'use strict'

const card = require('./weirding-woman.js')

describe("weirding-woman", () => {
  test('data', () => {
    expect(card.id).toBe("weirding-woman")
    expect(card.name).toBe("Weirding Woman")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
