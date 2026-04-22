'use strict'

const card = require('./priority-contracts.js')

describe("priority-contracts", () => {
  test('data', () => {
    expect(card.id).toBe("priority-contracts")
    expect(card.name).toBe("Priority Contracts")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
