'use strict'

const card = require('./shishakli.js')

describe("shishakli", () => {
  test('data', () => {
    expect(card.id).toBe("shishakli")
    expect(card.name).toBe("Shishakli")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
