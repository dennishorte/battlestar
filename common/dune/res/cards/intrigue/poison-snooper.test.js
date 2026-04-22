'use strict'

const card = require('./poison-snooper.js')

describe("poison-snooper", () => {
  test('data', () => {
    expect(card.id).toBe("poison-snooper")
    expect(card.name).toBe("Poison Snooper")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
