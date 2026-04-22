'use strict'

const card = require('./wheels-within-wheels.js')

describe("wheels-within-wheels", () => {
  test('data', () => {
    expect(card.id).toBe("wheels-within-wheels")
    expect(card.name).toBe("Wheels within Wheels")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
