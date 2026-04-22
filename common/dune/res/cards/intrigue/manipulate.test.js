'use strict'

const card = require('./manipulate.js')

describe("manipulate", () => {
  test('data', () => {
    expect(card.id).toBe("manipulate")
    expect(card.name).toBe("Manipulate")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
