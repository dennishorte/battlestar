'use strict'

const card = require('./branching-path.js')

describe("branching-path", () => {
  test('data', () => {
    expect(card.id).toBe("branching-path")
    expect(card.name).toBe("Branching Path")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
