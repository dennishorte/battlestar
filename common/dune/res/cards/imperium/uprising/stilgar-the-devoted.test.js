'use strict'

const card = require('./stilgar-the-devoted.js')

describe("stilgar-the-devoted", () => {
  test('data', () => {
    expect(card.id).toBe("stilgar-the-devoted")
    expect(card.name).toBe("Stilgar, The Devoted")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
