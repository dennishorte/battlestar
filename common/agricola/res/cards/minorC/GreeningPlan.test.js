const res = require('../../index.js')

describe('Greening Plan (C033)', () => {
  test('gives bonus points based on empty fields', () => {
    const card = res.getCardById('greening-plan-c033')

    expect(card.getEndGamePoints({ getEmptyFieldCount: () => 6 })).toBe(5)
    expect(card.getEndGamePoints({ getEmptyFieldCount: () => 5 })).toBe(3)
    expect(card.getEndGamePoints({ getEmptyFieldCount: () => 4 })).toBe(2)
    expect(card.getEndGamePoints({ getEmptyFieldCount: () => 2 })).toBe(1)
    expect(card.getEndGamePoints({ getEmptyFieldCount: () => 1 })).toBe(0)
  })
})
