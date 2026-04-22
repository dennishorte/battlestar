'use strict'

const card = require('./subversive-advisor.js')

describe("subversive-advisor", () => {
  test('data', () => {
    expect(card.id).toBe("subversive-advisor")
    expect(card.name).toBe("Subversive Advisor")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
