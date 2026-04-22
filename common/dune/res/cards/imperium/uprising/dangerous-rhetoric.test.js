'use strict'

const card = require('./dangerous-rhetoric.js')

describe("dangerous-rhetoric", () => {
  test('data', () => {
    expect(card.id).toBe("dangerous-rhetoric")
    expect(card.name).toBe("Dangerous Rhetoric")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
