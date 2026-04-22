'use strict'

const card = require('./viscious-talents.js')

describe("viscious-talents", () => {
  test('data', () => {
    expect(card.id).toBe("viscious-talents")
    expect(card.name).toBe("Viscious Talents")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
