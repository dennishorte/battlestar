'use strict'

const card = require('./thufir-hawat.js')

describe("thufir-hawat", () => {
  test('data', () => {
    expect(card.id).toBe("thufir-hawat")
    expect(card.name).toBe("Thufir Hawat")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
