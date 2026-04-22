'use strict'

const card = require('./desert-support.js')

describe("desert-support", () => {
  test('data', () => {
    expect(card.id).toBe("desert-support")
    expect(card.name).toBe("Desert Support")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
