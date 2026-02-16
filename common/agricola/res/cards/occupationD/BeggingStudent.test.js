const t = require('../../../testutil_v2.js')

describe('Begging Student', () => {
  test('onPlay gives 1 begging card', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['begging-student-d097'],
      },
    })
    game.run()

    // Play Begging Student via Lessons A (first occupation is free)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Begging Student')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['begging-student-d097'],
        beggingCards: 1,
      },
    })
  })

  test('onHarvestStart offers free occupation', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['begging-student-d097'],
        hand: ['test-occupation-1'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // 4 actions to complete work phase
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest starts: BeggingStudent onHarvestStart fires -> free occupation offer
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      round: 5,
      dennis: {
        occupations: ['begging-student-d097', 'test-occupation-1'],
        food: 8, // 10 + 2 (DL) - 4 (feeding)
        clay: 1,
      },
    })
  })
})
