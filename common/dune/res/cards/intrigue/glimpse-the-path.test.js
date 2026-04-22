'use strict'

const card = require('./glimpse-the-path.js')

describe("glimpse-the-path", () => {
  test('data', () => {
    expect(card.id).toBe("glimpse-the-path")
    expect(card.name).toBe("Glimpse the Path")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
