'use strict'

const card = require('./private-army.js')

describe("private-army", () => {
  test('data', () => {
    expect(card.id).toBe("private-army")
    expect(card.name).toBe("Private Army")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
