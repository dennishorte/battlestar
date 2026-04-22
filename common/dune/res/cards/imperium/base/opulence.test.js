'use strict'

const card = require('./opulence.js')

describe("opulence", () => {
  test('data', () => {
    expect(card.id).toBe("opulence")
    expect(card.name).toBe("Opulence")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
