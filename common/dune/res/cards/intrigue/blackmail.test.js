'use strict'

const card = require('./blackmail.js')

describe("blackmail", () => {
  test('data', () => {
    expect(card.id).toBe("blackmail")
    expect(card.name).toBe("Blackmail")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
