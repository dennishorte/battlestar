'use strict'

const card = require('./stilgar.js')

describe("stilgar", () => {
  test('data', () => {
    expect(card.id).toBe("stilgar")
    expect(card.name).toBe("Stilgar")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
