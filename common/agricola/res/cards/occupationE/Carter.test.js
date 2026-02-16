const t = require('../../../testutil_v2.js')

describe('Carter', () => {
  test('gives food equal to building resources taken in the next round', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['carter-e140'],
      },
    })
    game.run()

    // Round 2: play Carter (sets activeRound = 3)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Carter')

    // Finish round 2
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Round 3: Dennis takes Forest (wood accumulation space)
    // Forest accumulates 3 wood per round, round 3 = 3 wood accumulated
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3, // from Forest
        food: 5, // 2 (Day Laborer) + 3 (Carter: 3 wood taken = 3 food)
        occupations: ['carter-e140'],
      },
    })
  })

  test('does not give food outside the active round', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carter-e140'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('carter-e140').activeRound = 99 // far in the future
    })
    game.run()

    // Round 2: Dennis takes Forest — Carter should NOT trigger (activeRound=99)
    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3, // just from Forest
        food: 0, // no Carter bonus
        occupations: ['carter-e140'],
      },
    })
  })
})
