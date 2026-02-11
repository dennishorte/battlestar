const t = require('../../../testutil_v2.js')

describe('Corf', () => {
  test('gives 1 stone when any player takes 3+ stone', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Western Quarry'],
      dennis: {
        minorImprovements: ['corf-b079'],
      },
    })
    // Set stone accumulation to 4 so after replenish (+1) it's 5 (>= 3)
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.actionSpaces['take-stone-1'].accumulated = 4
    })
    game.run()

    // Dennis takes stone (5 accumulated) → onAnyAction fires → Corf gives 1 extra stone
    t.choose(game, 'Western Quarry')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Meeting Place')
    // Micah
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        stone: 6, // 5 from Western Quarry + 1 from Corf
        food: 1, // from Meeting Place
        minorImprovements: ['corf-b079'],
      },
    })
  })

  test('no stone when less than 3 stone taken', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Western Quarry'],
      dennis: {
        minorImprovements: ['corf-b079'],
      },
    })
    // Set stone accumulation to 1 so after replenish (+1) it's 2 (< 3)
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.actionSpaces['take-stone-1'].accumulated = 1
    })
    game.run()

    // Dennis takes stone (2 accumulated) → < 3, Corf does not trigger
    t.choose(game, 'Western Quarry')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Meeting Place')
    // Micah
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        stone: 2, // 2 from Western Quarry only (no Corf bonus)
        food: 1, // from Meeting Place
        minorImprovements: ['corf-b079'],
      },
    })
  })
})
