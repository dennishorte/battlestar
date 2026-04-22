'use strict'

const card = require('./withdrawn.js')

describe("withdrawn", () => {
  test('data', () => {
    expect(card.id).toBe("withdrawn")
    expect(card.name).toBe("Withdrawn")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
