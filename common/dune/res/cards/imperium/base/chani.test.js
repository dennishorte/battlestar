'use strict'

const card = require('./chani.js')

describe("chani", () => {
  test('data', () => {
    expect(card.id).toBe("chani")
    expect(card.name).toBe("Chani")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
