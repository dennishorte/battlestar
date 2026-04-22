'use strict'

const card = require('./court-intrigue.js')

describe("court-intrigue", () => {
  test('data', () => {
    expect(card.id).toBe("court-intrigue")
    expect(card.name).toBe("Court Intrigue")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
