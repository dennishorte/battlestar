'use strict'

const card = require('./dr-yueh.js')

describe("dr-yueh", () => {
  test('data', () => {
    expect(card.id).toBe("dr-yueh")
    expect(card.name).toBe("Dr. Yueh")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
