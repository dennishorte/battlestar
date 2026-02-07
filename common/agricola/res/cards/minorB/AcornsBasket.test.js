const t = require('../../../testutil.js')

describe('Acorns Basket (B084)', () => {
  test('schedules wild boar for next 2 rounds', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        reed: 1,
        hand: ['acorns-basket-b084'],
        occupations: ['wood-cutter', 'firewood-collector', 'seasonal-worker'],
      },
      round: 5,
    })
    game.run()

    game.state.round = 5
    t.playCard(game, 'dennis', 'acorns-basket-b084')

    const dennis = t.player(game)
    expect(game.state.scheduledBoar[dennis.name][6]).toBe(1)
    expect(game.state.scheduledBoar[dennis.name][7]).toBe(1)
  })
})
