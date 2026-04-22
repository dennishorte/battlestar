'use strict'

const card = require('./secret-of-the-sisterhood.js')

describe("secret-of-the-sisterhood", () => {
  test('data', () => {
    expect(card.id).toBe("secret-of-the-sisterhood")
    expect(card.name).toBe("Secret of the Sisterhood")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
