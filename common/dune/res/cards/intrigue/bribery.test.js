'use strict'

const card = require('./bribery.js')

describe("bribery", () => {
  test('data', () => {
    expect(card.id).toBe("bribery")
    expect(card.name).toBe("Bribery")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
