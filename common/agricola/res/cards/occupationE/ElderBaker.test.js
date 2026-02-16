const t = require('../../../testutil_v2.js')

describe('Elder Baker', () => {
  test('provides action space that gives 3 grain to owner', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['elder-baker-e161'],
        grain: 0,
      },
    })
    // Register the card-provided action space for occupations
    // (setBoard only auto-registers providesActionSpace for minor improvements)
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      const card = game.cards.byId('elder-baker-e161')
      game.registerCardActionSpace(player, card)
    })
    game.run()

    // Dennis uses the Elder Baker action space
    t.choose(game, 'Elder Baker')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 3, // from Elder Baker action space
        occupations: ['elder-baker-e161'],
      },
    })
  })

  test('owner-only action space not available to opponent', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['elder-baker-e161'],
      },
    })
    // Register the card-provided action space for occupations
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      const card = game.cards.byId('elder-baker-e161')
      game.registerCardActionSpace(player, card)
    })
    game.run()

    // Elder Baker should not be available to micah
    expect(t.currentChoices(game)).not.toContain('Elder Baker')
  })
})
