const res = require('../../index.js')

describe('Schnapps Distillery (C059)', () => {
  test('gives bonus points for 5th and 6th vegetable', () => {
    const card = res.getCardById('schnapps-distillery-c059')
    expect(card.getEndGamePoints({ vegetables: 6 })).toBe(2)
    expect(card.getEndGamePoints({ vegetables: 5 })).toBe(1)
    expect(card.getEndGamePoints({ vegetables: 4 })).toBe(0)
  })
})
