'use strict'

const card = require('./calculated-hire.js')
const { getIntrigueCards } = require('../../index.js')

describe("calculated-hire", () => {
  test('data', () => {
    expect(card.id).toBe("calculated-hire")
    expect(card.name).toBe("Calculated Hire")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("Base")
    expect(getIntrigueCards({ useBaseGameCards: true }).some(c => c.id === 'calculated-hire')).toBe(false)
  })
})
