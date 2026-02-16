const t = require('../../../testutil_v2.js')

describe('Beneficiary', () => {
  test('plays another occupation for 1 food when it is the 3rd occupation', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        hand: ['beneficiary-e097', 'test-occupation-3'],
        food: 3,
      },
    })
    game.run()

    // Play Beneficiary as 3rd occupation via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Beneficiary')
    // onPlay: 3rd occupation triggers — offer to play another for 1 food
    t.choose(game, 'Test Occupation 3')
    // buyMinorImprovement: no minors in hand, auto-skipped

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,  // 3 - 1 (occ cost for Beneficiary via Lessons A) - 1 (play occ via Beneficiary)
        occupations: ['test-occupation-1', 'test-occupation-2', 'beneficiary-e097', 'test-occupation-3'],
      },
    })
  })

  test('does not trigger when not the 3rd occupation', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        hand: ['beneficiary-e097', 'test-occupation-2'],
        food: 3,
      },
    })
    game.run()

    // Play Beneficiary as 2nd occupation — does not trigger
    t.choose(game, 'Lessons A')
    t.choose(game, 'Beneficiary')
    // onPlay: only 2 occupations, no trigger

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,  // 3 - 1 (occ cost)
        hand: ['test-occupation-2'],
        occupations: ['test-occupation-1', 'beneficiary-e097'],
      },
    })
  })

  test('plays minor improvement as part of the trigger', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        hand: ['beneficiary-e097', 'test-minor-1'],
        food: 3,
      },
    })
    game.run()

    // Play Beneficiary as 3rd occupation
    t.choose(game, 'Lessons A')
    t.choose(game, 'Beneficiary')
    // onPlay: no occupations in hand, auto-skipped
    // Then offer to play minor improvement
    t.choose(game, 'Test Minor 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,  // 3 - 1 (occ cost for Beneficiary)
        occupations: ['test-occupation-1', 'test-occupation-2', 'beneficiary-e097'],
        minorImprovements: ['test-minor-1'],
      },
    })
  })
})
