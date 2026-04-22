'use strict'

const card = require('./to-the-victor.js')

describe("to-the-victor", () => {
  test('data', () => {
    expect(card.id).toBe("to-the-victor")
    expect(card.name).toBe("To the Victor …")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
