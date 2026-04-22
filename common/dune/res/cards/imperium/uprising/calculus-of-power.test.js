'use strict'

const card = require('./calculus-of-power.js')

describe("calculus-of-power", () => {
  test('data', () => {
    expect(card.id).toBe("calculus-of-power")
    expect(card.name).toBe("Calculus of Power")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
