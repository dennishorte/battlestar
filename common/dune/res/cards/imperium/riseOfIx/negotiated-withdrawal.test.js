'use strict'

const card = require('./negotiated-withdrawal.js')

describe("negotiated-withdrawal", () => {
  test('data', () => {
    expect(card.id).toBe("negotiated-withdrawal")
    expect(card.name).toBe("Negotiated Withdrawal")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
