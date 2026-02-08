const res = require('../../index.js')

describe('Wood Rake (D032)', () => {
  test('gives 2 points when had at least 7 goods in fields before final harvest', () => {
    const card = res.getCardById('wood-rake-d032')
    const player = { goodsInFieldsBeforeFinalHarvest: 7 }

    expect(card.getEndGamePoints(player)).toBe(2)
  })

  test('gives 2 points when had more than 7 goods in fields', () => {
    const card = res.getCardById('wood-rake-d032')
    const player = { goodsInFieldsBeforeFinalHarvest: 10 }

    expect(card.getEndGamePoints(player)).toBe(2)
  })

  test('gives 0 points when had fewer than 7 goods in fields', () => {
    const card = res.getCardById('wood-rake-d032')
    const player = { goodsInFieldsBeforeFinalHarvest: 6 }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('wood-rake-d032')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
