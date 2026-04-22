'use strict'

const card = require('./sardaukar-legion.js')

describe("sardaukar-legion", () => {
  test('data', () => {
    expect(card.id).toBe("sardaukar-legion")
    expect(card.name).toBe("Sardaukar Legion")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
