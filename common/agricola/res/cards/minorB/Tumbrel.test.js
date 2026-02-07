const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tumbrel (B054)', () => {
  test('gives 2 food on play', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 1,
        food: 0,
        hand: ['tumbrel-b054'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'tumbrel-b054')

    const dennis = t.player(game)
    expect(dennis.food).toBe(2)
  })

  test('gives food for stables on sow action', () => {
    const card = res.getCardById('tumbrel-b054')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getStableCount = () => 3

    card.onSow(game, dennis)

    expect(dennis.food).toBe(3)
  })
})
