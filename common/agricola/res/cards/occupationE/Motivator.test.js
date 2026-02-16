const t = require('../../../testutil_v2.js')

describe('Motivator', () => {
  test('card can be played without crashing', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['motivator-e093'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Motivator')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['motivator-e093'],
      },
    })
  })

  test('does not trigger when farmyard has unused spaces (default case)', () => {
    // Default farmyard has many unused spaces, so Motivator should not trigger
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['motivator-e093'],
      },
    })
    game.run()

    // Round 1 starts, onWorkPhaseStart fires.
    // Dennis has unused farmyard spaces, so Motivator should not offer the bonus.
    // If it did trigger, there would be an extra choice prompt.
    t.choose(game, 'Day Laborer')  // dennis - no Motivator prompt before this

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // from Day Laborer
        occupations: ['motivator-e093'],
      },
    })
  })
})
