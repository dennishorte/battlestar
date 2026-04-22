'use strict'

const card = require('./sinister.js')

describe("sinister", () => {
  test('data', () => {
    expect(card.id).toBe("sinister")
    expect(card.name).toBe("Sinister")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
