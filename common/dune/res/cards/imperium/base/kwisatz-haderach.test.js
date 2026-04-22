'use strict'

const card = require('./kwisatz-haderach.js')

describe("kwisatz-haderach", () => {
  test('data', () => {
    expect(card.id).toBe("kwisatz-haderach")
    expect(card.name).toBe("Kwisatz Haderach")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
