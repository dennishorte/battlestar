'use strict'

const card = require('./bypass-protocol.js')

describe("bypass-protocol", () => {
  test('data', () => {
    expect(card.id).toBe("bypass-protocol")
    expect(card.name).toBe("Bypass Protocol")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
