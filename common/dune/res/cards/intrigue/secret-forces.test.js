'use strict'

const card = require('./secret-forces.js')

describe("secret-forces", () => {
  test('data', () => {
    expect(card.id).toBe("secret-forces")
    expect(card.name).toBe("Secret Forces")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
