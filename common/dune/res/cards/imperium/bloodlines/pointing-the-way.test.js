'use strict'

const card = require('./pointing-the-way.js')

describe("pointing-the-way", () => {
  test('data', () => {
    expect(card.id).toBe("pointing-the-way")
    expect(card.name).toBe("Pointing the Way")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
