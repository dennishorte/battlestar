'use strict'

const card = require('./esmar-tuek.js')

describe("esmar-tuek", () => {
  test('data', () => {
    expect(card.id).toBe("esmar-tuek")
    expect(card.name).toBe("Esmar Tuek")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
