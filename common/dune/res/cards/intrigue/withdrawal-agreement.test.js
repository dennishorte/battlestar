'use strict'

const card = require('./withdrawal-agreement.js')

describe("withdrawal-agreement", () => {
  test('data', () => {
    expect(card.id).toBe("withdrawal-agreement")
    expect(card.name).toBe("Withdrawal Agreement")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
