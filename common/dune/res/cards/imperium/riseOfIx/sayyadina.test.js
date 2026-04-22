'use strict'

const card = require('./sayyadina.js')

describe("sayyadina", () => {
  test('data', () => {
    expect(card.id).toBe("sayyadina")
    expect(card.name).toBe("Sayyadina")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
