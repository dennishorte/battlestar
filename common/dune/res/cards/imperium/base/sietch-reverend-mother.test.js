'use strict'

const card = require('./sietch-reverend-mother.js')

describe("sietch-reverend-mother", () => {
  test('data', () => {
    expect(card.id).toBe("sietch-reverend-mother")
    expect(card.name).toBe("Sietch Reverend Mother")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
