const t = require('../../../testutil_v2.js')

describe('Rock Beater', () => {
  test('card can be played without crashing', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['rock-beater-e150'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Rock Beater')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['rock-beater-e150'],
      },
    })
  })

  test('allows using occupied Resource Market (provides stone + reed)', () => {
    // RockBeater allows using occupied spaces that provide stone + another building resource
    // Resource Market in 4-player game provides food, reed, and stone
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      // Turn order: eliya -> dennis -> micah -> scott
      firstPlayer: 'eliya',
      dennis: {
        occupations: ['rock-beater-e150'],
      },
    })
    game.run()

    // eliya takes Resource Market (occupies it)
    t.choose(game, 'Resource Market')
    t.choose(game, 'reed')  // eliya chooses reed

    // dennis should still see Resource Market as a choice due to RockBeater
    expect(t.currentChoices(game)).toContain('Resource Market')
    t.choose(game, 'Resource Market')
    t.choose(game, 'stone')  // dennis chooses stone

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        stone: 1,
        occupations: ['rock-beater-e150'],
      },
    })
  })
})
