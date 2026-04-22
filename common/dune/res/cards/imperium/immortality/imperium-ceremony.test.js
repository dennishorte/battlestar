'use strict'

const card = require('./imperium-ceremony.js')

describe("imperium-ceremony", () => {
  test('data', () => {
    expect(card.id).toBe("imperium-ceremony")
    expect(card.name).toBe("Imperium Ceremony")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
