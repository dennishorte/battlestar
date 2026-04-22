'use strict'

const card = require('./master-tactician.js')

describe("master-tactician", () => {
  test('data', () => {
    expect(card.id).toBe("master-tactician")
    expect(card.name).toBe("Master Tactician")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
