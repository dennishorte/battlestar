'use strict'

const card = require('./choam-profits.js')

describe("choam-profits", () => {
  test('data', () => {
    expect(card.id).toBe("choam-profits")
    expect(card.name).toBe("CHOAM Profits")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
