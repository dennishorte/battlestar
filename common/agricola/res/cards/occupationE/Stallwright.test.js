const t = require('../../../testutil_v2.js')

describe('Stallwright', () => {
  test('offers free stable when Stallwright is the 2nd occupation', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'], // 1st occupation already played
        hand: ['stallwright-e089'],
        food: 1, // 2nd occ costs 1 food
      },
    })
    game.run()

    // Play Stallwright as 2nd occupation
    t.choose(game, 'Lessons A')
    t.choose(game, 'Stallwright')
    // Stallwright is now the 2nd occupation -> offers free stable
    t.choose(game, 'Build stable at 0,1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['test-occupation-1', 'stallwright-e089'],
        farmyard: {
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('offers free stable when playing 3rd occupation after Stallwright', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stallwright-e089', 'test-occupation-1'], // 2 played
        hand: ['test-occupation-2'],
        food: 1, // 3rd occ costs 1 food
      },
    })
    game.run()

    // Play 3rd occupation
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 2')
    // Stallwright onPlayOccupation fires: 3rd occ -> offers free stable
    t.choose(game, 'Build stable at 0,1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['stallwright-e089', 'test-occupation-1', 'test-occupation-2'],
        farmyard: {
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not offer stable for 4th occupation (not in trigger list)', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stallwright-e089', 'test-occupation-1', 'test-occupation-2'], // 3 played
        hand: ['test-occupation-3'],
        food: 1,
      },
    })
    game.run()

    // Play 4th occupation
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 3')
    // 4th occ is NOT in [2, 3, 5, 7] -> no stable offer

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['stallwright-e089', 'test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
  })

  test('can skip the free stable offer', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        hand: ['stallwright-e089'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stallwright')
    // 2nd occupation -> skip stable
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['test-occupation-1', 'stallwright-e089'],
      },
    })
  })
})
