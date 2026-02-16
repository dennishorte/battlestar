const t = require('../../../testutil_v2.js')

describe('Lazybones', () => {
  test('builds free stable when opponent uses Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['lazybones-e148'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('lazybones-e148').stables = {
        'take-grain': true,
        'plow-field': true,
        'day-laborer': true,
        'build-rooms': true,
      }
    })
    game.run()

    // Micah takes Grain Seeds -> Lazybones triggers for Dennis -> build free stable
    t.choose(game, 'Grain Seeds')
    // Dennis is prompted to build a stable
    t.choose(game, '2,0') // place stable at row 2, col 0

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        occupations: ['lazybones-e148'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
      micah: {
        grain: 1,
      },
    })
  })

  test('does not trigger when owner uses Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lazybones-e148'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('lazybones-e148').stables = {
        'take-grain': true,
        'plow-field': true,
        'day-laborer': true,
        'build-rooms': true,
      }
    })
    game.run()

    // Dennis (owner) takes Grain Seeds -> Lazybones should NOT trigger
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        occupations: ['lazybones-e148'],
      },
    })
  })
})
