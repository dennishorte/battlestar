'use strict'

const card = require('./spiritual-fervor.js')

describe("spiritual-fervor", () => {
  test('data', () => {
    expect(card.id).toBe("spiritual-fervor")
    expect(card.name).toBe("Spiritual Fervor")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
