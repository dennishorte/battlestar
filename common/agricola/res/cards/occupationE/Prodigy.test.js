const t = require('../../../testutil_v2.js')

describe('Prodigy', () => {
  test('gives 1 bonus point per improvement when played as 1st occupation', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['prodigy-e098'],
        minorImprovements: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Prodigy')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        bonusPoints: 1, // 1 minor improvement in play
        occupations: ['prodigy-e098'],
        minorImprovements: ['test-minor-1'],
      },
    })
  })

  test('gives 0 bonus points when no improvements in play', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['prodigy-e098'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Prodigy')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        bonusPoints: 0,
        occupations: ['prodigy-e098'],
      },
    })
  })

  test('does not give bonus points when not 1st occupation', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        hand: ['prodigy-e098'],
        minorImprovements: ['test-minor-1', 'test-minor-2'],
        food: 1, // 2nd occ costs 1 food
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Prodigy')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        bonusPoints: 0, // Not 1st occupation, no bonus
        occupations: ['test-occupation-1', 'prodigy-e098'],
        minorImprovements: ['test-minor-1', 'test-minor-2'],
      },
    })
  })
})
