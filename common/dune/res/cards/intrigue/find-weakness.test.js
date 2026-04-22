'use strict'

const card = require('./find-weakness.js')

describe("find-weakness", () => {
  test('data', () => {
    expect(card.id).toBe("find-weakness")
    expect(card.name).toBe("Find Weakness")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
