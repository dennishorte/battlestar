'use strict'

const card = require('./stillsuit-manufacturer.js')

describe("stillsuit-manufacturer", () => {
  test('data', () => {
    expect(card.id).toBe("stillsuit-manufacturer")
    expect(card.name).toBe("Stillsuit Manufacturer")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
