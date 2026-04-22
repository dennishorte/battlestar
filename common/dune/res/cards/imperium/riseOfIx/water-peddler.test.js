'use strict'

const card = require('./water-peddler.js')

describe("water-peddler", () => {
  test('data', () => {
    expect(card.id).toBe("water-peddler")
    expect(card.name).toBe("Water Peddler")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
