'use strict'

const card = require('./shadow-alliance.js')

describe("shadow-alliance", () => {
  test('data', () => {
    expect(card.id).toBe("shadow-alliance")
    expect(card.name).toBe("Shadow Alliance")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
