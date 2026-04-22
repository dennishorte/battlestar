'use strict'

const card = require('./steersman.js')

describe("steersman", () => {
  test('data', () => {
    expect(card.id).toBe("steersman")
    expect(card.name).toBe("Steersman")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
