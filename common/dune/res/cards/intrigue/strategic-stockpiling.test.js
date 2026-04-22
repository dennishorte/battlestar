'use strict'

const card = require('./strategic-stockpiling.js')

describe("strategic-stockpiling", () => {
  test('data', () => {
    expect(card.id).toBe("strategic-stockpiling")
    expect(card.name).toBe("Strategic Stockpiling")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
