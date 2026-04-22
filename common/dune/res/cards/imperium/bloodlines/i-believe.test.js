'use strict'

const card = require('./i-believe.js')

describe("i-believe", () => {
  test('data', () => {
    expect(card.id).toBe("i-believe")
    expect(card.name).toBe("I Believe")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
