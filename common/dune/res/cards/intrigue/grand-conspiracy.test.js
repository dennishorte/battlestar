'use strict'

const card = require('./grand-conspiracy.js')

describe("grand-conspiracy", () => {
  test('data', () => {
    expect(card.id).toBe("grand-conspiracy")
    expect(card.name).toBe("Grand Conspiracy")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
