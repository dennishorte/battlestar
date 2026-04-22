'use strict'

const card = require('./counterattack.js')

describe("counterattack", () => {
  test('data', () => {
    expect(card.id).toBe("counterattack")
    expect(card.name).toBe("Counterattack")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
