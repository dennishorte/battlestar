'use strict'

const card = require('./gene-manipulation.js')

describe("gene-manipulation", () => {
  test('data', () => {
    expect(card.id).toBe("gene-manipulation")
    expect(card.name).toBe("Gene Manipulation")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
