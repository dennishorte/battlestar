const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Corf (B079)', () => {
  test('gives 1 stone when any player takes 3+ stone', () => {
    const card = res.getCardById('corf-b079')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.stone = 0

    card.onAnyAction(game, micah, 'take-stone-1', dennis, { stoneTaken: 3 })

    expect(dennis.stone).toBe(1)
  })

  test('does not give stone when less than 3 taken', () => {
    const card = res.getCardById('corf-b079')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.stone = 0

    card.onAnyAction(game, micah, 'take-stone-1', dennis, { stoneTaken: 2 })

    expect(dennis.stone).toBe(0)
  })
})
