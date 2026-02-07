const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mining Hammer (B016)', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 1,
        food: 0,
        hand: ['mining-hammer-b016'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'mining-hammer-b016')

    const dennis = t.player(game)
    expect(dennis.food).toBe(1)
  })

  test('has onRenovate hook', () => {
    const card = res.getCardById('mining-hammer-b016')
    expect(card.onRenovate).toBeDefined()
  })
})
