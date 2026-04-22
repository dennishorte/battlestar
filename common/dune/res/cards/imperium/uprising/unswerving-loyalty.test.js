'use strict'

const card = require('./unswerving-loyalty.js')

describe("unswerving-loyalty", () => {
  test('data', () => {
    expect(card.id).toBe("unswerving-loyalty")
    expect(card.name).toBe("Unswerving Loyalty")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
