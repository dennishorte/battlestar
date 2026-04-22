'use strict'

const card = require('./lady-jessica.js')

describe("lady-jessica", () => {
  test('data', () => {
    expect(card.id).toBe("lady-jessica")
    expect(card.name).toBe("Lady Jessica")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
