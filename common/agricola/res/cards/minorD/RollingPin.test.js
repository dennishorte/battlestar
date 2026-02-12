const t = require('../../../testutil_v2.js')

describe('Rolling Pin', () => {
  test('gives 1 food on return home if clay > wood', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rolling-pin-d052'],
        occupations: ['test-occupation-1'],
        clay: 5,
        wood: 2,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('rolling-pin-d052')

    // Directly test the hook
    dennis.food = 0
    card.definition.onReturnHome(game, dennis)
    expect(dennis.food).toBe(1)
  })

  test('does not give food if clay <= wood', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rolling-pin-d052'],
        occupations: ['test-occupation-1'],
        clay: 3,
        wood: 3,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const card = game.cards.byId('rolling-pin-d052')

    dennis.food = 0
    card.definition.onReturnHome(game, dennis)
    expect(dennis.food).toBe(0)
  })
})
