'use strict'

const card = require('./reverend-mother-mohiam.js')

describe("reverend-mother-mohiam", () => {
  test('data', () => {
    expect(card.id).toBe("reverend-mother-mohiam")
    expect(card.name).toBe("Reverend Mother Mohiam")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
