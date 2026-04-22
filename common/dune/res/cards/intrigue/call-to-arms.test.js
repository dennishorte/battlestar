'use strict'

const card = require('./call-to-arms.js')

describe("call-to-arms", () => {
  test('data', () => {
    expect(card.id).toBe("call-to-arms")
    expect(card.name).toBe("Call to Arms")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
