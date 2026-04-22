'use strict'

const card = require('./shadowy-bargain.js')

describe("shadowy-bargain", () => {
  test('data', () => {
    expect(card.id).toBe("shadowy-bargain")
    expect(card.name).toBe("Shadowy Bargain")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
