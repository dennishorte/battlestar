'use strict'

const card = require('./shrewd.js')

describe("shrewd", () => {
  test('data', () => {
    expect(card.id).toBe("shrewd")
    expect(card.name).toBe("Shrewd")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
