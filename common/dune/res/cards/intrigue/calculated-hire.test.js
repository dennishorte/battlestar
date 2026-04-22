'use strict'

const card = require('./calculated-hire.js')

describe("calculated-hire", () => {
  test('data', () => {
    expect(card.id).toBe("calculated-hire")
    expect(card.name).toBe("Calculated Hire")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
