const res = require('../../index.js')

describe('Lasso (B024)', () => {
  test('allows double worker placement on animal markets', () => {
    const card = res.getCardById('lasso-b024')
    expect(card.allowDoubleWorkerPlacement).toEqual(['take-sheep', 'take-boar', 'take-cattle'])
  })

  test('costs 1 reed', () => {
    const card = res.getCardById('lasso-b024')
    expect(card.cost).toEqual({ reed: 1 })
  })
})
