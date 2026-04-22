'use strict'

const card = require('./honor-guard.js')

describe("honor-guard", () => {
  test('data', () => {
    expect(card.id).toBe("honor-guard")
    expect(card.name).toBe("Honor Guard")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
