'use strict'

const card = require('./overthrow.js')

describe("overthrow", () => {
  test('data', () => {
    expect(card.id).toBe("overthrow")
    expect(card.name).toBe("Overthrow")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
