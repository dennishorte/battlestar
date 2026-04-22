'use strict'

const card = require('./contingency-plan.js')

describe("contingency-plan", () => {
  test('data', () => {
    expect(card.id).toBe("contingency-plan")
    expect(card.name).toBe("Contingency Plan")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
