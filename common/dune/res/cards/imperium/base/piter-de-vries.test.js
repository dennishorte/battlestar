'use strict'

const card = require('./piter-de-vries.js')

describe("piter-de-vries", () => {
  test('data', () => {
    expect(card.id).toBe("piter-de-vries")
    expect(card.name).toBe("Piter De Vries")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
