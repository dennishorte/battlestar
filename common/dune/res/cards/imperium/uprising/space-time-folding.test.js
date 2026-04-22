'use strict'

const card = require('./space-time-folding.js')

describe("space-time-folding", () => {
  test('data', () => {
    expect(card.id).toBe("space-time-folding")
    expect(card.name).toBe("Space-Time Folding")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
