const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Field Merchant (B103)', () => {
  test('gives 1 wood and 1 reed on play', () => {
    const card = res.getCardById('field-merchant-b103')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.reed = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(dennis.reed).toBe(1)
  })

  test('gives 1 food when declining minor improvement', () => {
    const card = res.getCardById('field-merchant-b103')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onDeclineMinorImprovement(game, dennis)

    expect(dennis.food).toBe(1)
  })

  test('gives 1 vegetable when declining major improvement', () => {
    const card = res.getCardById('field-merchant-b103')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onDeclineMajorImprovement(game, dennis)

    expect(dennis.vegetables).toBe(1)
  })
})
