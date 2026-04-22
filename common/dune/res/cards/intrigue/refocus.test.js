'use strict'

const card = require('./refocus.js')

describe("refocus", () => {
  test('data', () => {
    expect(card.id).toBe("refocus")
    expect(card.name).toBe("Refocus")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
