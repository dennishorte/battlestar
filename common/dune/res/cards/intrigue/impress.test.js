'use strict'

const card = require('./impress.js')

describe("impress", () => {
  test('data', () => {
    expect(card.id).toBe("impress")
    expect(card.name).toBe("Impress")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
