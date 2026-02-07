const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forest Stone (B048)', () => {
  test('places 2 food on card on play', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 2,
        hand: ['forest-stone-b048'],
        occupations: ['wood-cutter'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'forest-stone-b048')

    const dennis = t.player(game)
    expect(dennis.forestStoneFood).toBe(2)
  })

  test('gives food from card on wood action', () => {
    const card = res.getCardById('forest-stone-b048')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.forestStoneFood = 2
    dennis.food = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(1)
    expect(dennis.forestStoneFood).toBe(1)
  })

  test('adds food to card on stone action', () => {
    const card = res.getCardById('forest-stone-b048')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.forestStoneFood = 1

    card.onAction(game, dennis, 'take-stone-1')

    expect(dennis.forestStoneFood).toBe(3)
  })
})
