'use strict'

const card = require('./devour.js')

describe("devour", () => {
  test('data', () => {
    expect(card.id).toBe("devour")
    expect(card.name).toBe("Devour")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
