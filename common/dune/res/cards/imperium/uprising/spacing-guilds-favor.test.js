'use strict'

const card = require('./spacing-guilds-favor.js')

describe("spacing-guilds-favor", () => {
  test('data', () => {
    expect(card.id).toBe("spacing-guilds-favor")
    expect(card.name).toBe("Spacing Guild's Favor")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
