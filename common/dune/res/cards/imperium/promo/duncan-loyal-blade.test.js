'use strict'

const card = require('./duncan-loyal-blade.js')

describe("duncan-loyal-blade", () => {
  test('data', () => {
    expect(card.id).toBe("duncan-loyal-blade")
    expect(card.name).toBe("Duncan, Loyal Blade")
    expect(card.source).toBe("Promo")
    expect(card.compatibility).toBe("All")
  })
})
