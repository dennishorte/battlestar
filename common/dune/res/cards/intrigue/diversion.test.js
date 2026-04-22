'use strict'

const card = require('./diversion.js')

describe("diversion", () => {
  test('data', () => {
    expect(card.id).toBe("diversion")
    expect(card.name).toBe("Diversion")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
