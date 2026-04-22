'use strict'

const card = require('./leverage.js')

describe("leverage", () => {
  test('data', () => {
    expect(card.id).toBe("leverage")
    expect(card.name).toBe("Leverage")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
