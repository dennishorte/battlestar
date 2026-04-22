'use strict'

const card = require('./imperial-shock-trooper.js')

describe("imperial-shock-trooper", () => {
  test('data', () => {
    expect(card.id).toBe("imperial-shock-trooper")
    expect(card.name).toBe("Imperial Shock Trooper")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
