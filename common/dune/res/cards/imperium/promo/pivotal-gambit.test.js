'use strict'

const card = require('./pivotal-gambit.js')

describe("pivotal-gambit", () => {
  test('data', () => {
    expect(card.id).toBe("pivotal-gambit")
    expect(card.name).toBe("Pivotal Gambit")
    expect(card.source).toBe("Promo")
    expect(card.compatibility).toBe("All")
  })
})
