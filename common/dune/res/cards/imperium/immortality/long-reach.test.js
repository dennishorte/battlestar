'use strict'

const card = require('./long-reach.js')

describe("long-reach", () => {
  test('data', () => {
    expect(card.id).toBe("long-reach")
    expect(card.name).toBe("Long Reach")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
