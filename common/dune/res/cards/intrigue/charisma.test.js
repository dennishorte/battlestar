'use strict'

const card = require('./charisma.js')

describe("charisma", () => {
  test('data', () => {
    expect(card.id).toBe("charisma")
    expect(card.name).toBe("Charisma")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
