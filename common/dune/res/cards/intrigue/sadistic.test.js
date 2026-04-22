'use strict'

const card = require('./sadistic.js')

describe("sadistic", () => {
  test('data', () => {
    expect(card.id).toBe("sadistic")
    expect(card.name).toBe("Sadistic")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
