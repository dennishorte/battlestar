'use strict'

const card = require('./controlled.js')

describe("controlled", () => {
  test('data', () => {
    expect(card.id).toBe("controlled")
    expect(card.name).toBe("Controlled")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
