const t = require('../../../testutil_v2.js')

describe('Usufructuary', () => {
  test('gives food equal to total other occupations in play when played as 1st occupation', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['usufructuary-e157'],
      },
      micah: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    // Play Usufructuary as 1st occupation
    // Other occupations in play: micah has 2
    // food = min(7, 2) = 2
    t.choose(game, 'Lessons A')
    t.choose(game, 'Usufructuary')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        occupations: ['usufructuary-e157'],
      },
    })
  })

  test('does not give food when not 1st occupation', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        hand: ['usufructuary-e157'],
        food: 1, // 2nd occ costs 1 food
      },
      micah: {
        occupations: ['test-occupation-2'],
      },
    })
    game.run()

    // Play Usufructuary as 2nd occupation — should not trigger
    t.choose(game, 'Lessons A')
    t.choose(game, 'Usufructuary')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 0, // no food from Usufructuary (not 1st occ)
        occupations: ['test-occupation-1', 'usufructuary-e157'],
      },
    })
  })

  test('caps food at 7', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['usufructuary-e157'],
      },
      micah: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
      },
      scott: {
        occupations: ['test-occupation-5', 'test-occupation-6', 'test-occupation-7', 'test-occupation-8'],
      },
    })
    game.run()

    // Other occupations in play: micah 4 + scott 4 = 8
    // food = min(7, 8) = 7
    t.choose(game, 'Lessons A')
    t.choose(game, 'Usufructuary')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 7,
        occupations: ['usufructuary-e157'],
      },
    })
  })
})
