'use strict'

const card = require('./bombast.js')

describe("bombast", () => {
  test('data', () => {
    expect(card.id).toBe("bombast")
    expect(card.name).toBe("Bombast")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
