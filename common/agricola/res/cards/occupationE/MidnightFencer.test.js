const t = require('../../../testutil_v2.js')

describe('Midnight Fencer', () => {
  test('does not trigger at non-final harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // harvest 1, not the last
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['midnight-fencer-e149'],
        food: 8,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest fires but MidnightFencer should NOT trigger (not harvest 6)
    // No fence-stealing prompt should appear
    t.testBoard(game, {
      round: 5,
      dennis: {
        food: 6, // 8 + 2 - 4
        clay: 1, // Clay Pit accumulates 1
        occupations: ['midnight-fencer-e149'],
      },
    })
  })

  test('card can be played without crashing', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['midnight-fencer-e149'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Midnight Fencer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['midnight-fencer-e149'],
      },
    })
  })
})
