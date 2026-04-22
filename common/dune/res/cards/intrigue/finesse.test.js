'use strict'

const card = require('./finesse.js')

describe("finesse", () => {
  test('data', () => {
    expect(card.id).toBe("finesse")
    expect(card.name).toBe("Finesse")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
