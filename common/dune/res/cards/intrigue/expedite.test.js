'use strict'

const card = require('./expedite.js')

describe("expedite", () => {
  test('data', () => {
    expect(card.id).toBe("expedite")
    expect(card.name).toBe("Expedite")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
