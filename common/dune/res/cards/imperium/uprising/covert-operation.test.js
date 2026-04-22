'use strict'

const card = require('./covert-operation.js')

describe("covert-operation", () => {
  test('data', () => {
    expect(card.id).toBe("covert-operation")
    expect(card.name).toBe("Covert Operation")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
