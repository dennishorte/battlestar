'use strict'

const card = require('./thumper.js')

describe("thumper", () => {
  test('data', () => {
    expect(card.id).toBe("thumper")
    expect(card.name).toBe("Thumper")
    expect(card.source).toBe("Promo")
    expect(card.compatibility).toBe("All")
  })
})
