const t = require('../../../testutil_v2.js')

describe('Piggy Bank', () => {
  function piggyBankAction(game) {
    const dennis = game.players.byName('dennis')
    return game.getAnytimeActions(dennis).find(a => a.cardName === 'Piggy Bank')
  }

  test('store 1 food at end of work phase', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['piggy-bank-e027'],
      },
    })
    game.run()

    // Play 4 actions to complete work phase
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Work phase ends → Piggy Bank triggers for dennis
    t.choose(game, 'Store 1 food on Piggy Bank')

    t.testBoard(game, {
      dennis: {
        food: 1,    // 2 (Day Laborer) - 1 (Piggy Bank) = 1
        grain: 1,   // from Grain Seeds
        minorImprovements: ['piggy-bank-e027'],
      },
    })
  })

  test('anytime action available with 6 food stored', () => {
    const game = t.fixture({ cardSets: ['minorE'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['piggy-bank-e027'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('piggy-bank-e027').stored = 6
    })
    game.run()

    expect(piggyBankAction(game)).toBeDefined()
  })

  test('anytime action not available with fewer than 6 food stored', () => {
    const game = t.fixture({ cardSets: ['minorE'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['piggy-bank-e027'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('piggy-bank-e027').stored = 5
    })
    game.run()

    expect(piggyBankAction(game)).toBeUndefined()
  })

  test('discards 6 food and builds a major improvement at no cost', () => {
    const game = t.fixture({ cardSets: ['minorE'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['piggy-bank-e027'],
        clay: 0,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('piggy-bank-e027').stored = 6
    })
    game.run()

    t.anytimeAction(game, piggyBankAction(game))
    t.choose(game, 'Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        minorImprovements: ['piggy-bank-e027'],
        majorImprovements: ['fireplace-2'],
      },
    })
    expect(game.cardState('piggy-bank-e027').stored).toBe(0)
    expect(piggyBankAction(game)).toBeUndefined()
  })
})
