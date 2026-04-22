'use strict'

const card = require('./mercenaries.js')

describe("mercenaries", () => {
  test('data', () => {
    expect(card.id).toBe("mercenaries")
    expect(card.name).toBe("Mercenaries")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
