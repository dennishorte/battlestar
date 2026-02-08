const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Conjurer (OccA 155)', () => {
  test('gives 1 wood and 1 grain when using traveling players', () => {
    const card = res.getCardById('conjurer-a155')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.grain = 0

    card.onAction(game, dennis, 'traveling-players')

    expect(dennis.wood).toBe(1)
    expect(dennis.grain).toBe(1)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('conjurer-a155')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.grain = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(0)
    expect(dennis.grain).toBe(0)
  })
})
