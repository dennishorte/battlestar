'use strict'

const card = require('./unnatural.js')

describe("unnatural", () => {
  test('data', () => {
    expect(card.id).toBe("unnatural")
    expect(card.name).toBe("Unnatural")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
