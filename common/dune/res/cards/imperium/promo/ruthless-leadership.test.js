'use strict'

const card = require('./ruthless-leadership.js')

describe("ruthless-leadership", () => {
  test('data', () => {
    expect(card.id).toBe("ruthless-leadership")
    expect(card.name).toBe("Ruthless Leadership")
    expect(card.source).toBe("Promo")
    expect(card.compatibility).toBe("Bloodlines")
  })
})
