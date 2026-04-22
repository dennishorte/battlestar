'use strict'

const card = require('./replacement-eyes.js')

describe("replacement-eyes", () => {
  test('data', () => {
    expect(card.id).toBe("replacement-eyes")
    expect(card.name).toBe("Replacement Eyes")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
