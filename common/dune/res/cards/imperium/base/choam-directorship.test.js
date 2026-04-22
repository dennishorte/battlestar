'use strict'

const card = require('./choam-directorship.js')

describe("choam-directorship", () => {
  test('data', () => {
    expect(card.id).toBe("choam-directorship")
    expect(card.name).toBe("CHOAM Directorship")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
