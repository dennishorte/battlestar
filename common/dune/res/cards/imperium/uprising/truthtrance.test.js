'use strict'

const card = require('./truthtrance.js')

describe("truthtrance", () => {
  test('data', () => {
    expect(card.id).toBe("truthtrance")
    expect(card.name).toBe("Truthtrance")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
