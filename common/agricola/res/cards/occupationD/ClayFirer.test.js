const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Firer (OccD 162)', () => {
  test('gives 2 clay on play', () => {
    const card = res.getCardById('clay-firer-d162')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(2)
  })

  test('has anytime conversion from 2 clay to 1 stone', () => {
    const card = res.getCardById('clay-firer-d162')

    expect(card.allowsAnytimeConversion).toContainEqual({
      from: { clay: 2 },
      to: { stone: 1 },
    })
  })

  test('has anytime conversion from 3 clay to 2 stone', () => {
    const card = res.getCardById('clay-firer-d162')

    expect(card.allowsAnytimeConversion).toContainEqual({
      from: { clay: 3 },
      to: { stone: 2 },
    })
  })
})
