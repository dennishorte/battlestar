'use strict'

const card = require('./imperial-bashar.js')

describe("imperial-bashar", () => {
  test('data', () => {
    expect(card.id).toBe("imperial-bashar")
    expect(card.name).toBe("Imperial Bashar")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
