'use strict'

const card = require('./gurney-halleck.js')

describe("gurney-halleck", () => {
  test('data', () => {
    expect(card.id).toBe("gurney-halleck")
    expect(card.name).toBe("Gurney Halleck")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
