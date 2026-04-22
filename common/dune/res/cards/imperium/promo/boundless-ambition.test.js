'use strict'

const card = require('./boundless-ambition.js')

describe("boundless-ambition", () => {
  test('data', () => {
    expect(card.id).toBe("boundless-ambition")
    expect(card.name).toBe("Boundless Ambition")
    expect(card.source).toBe("Promo")
    expect(card.compatibility).toBe("All")
  })
})
