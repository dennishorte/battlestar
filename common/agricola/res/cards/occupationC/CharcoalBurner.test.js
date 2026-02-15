const t = require('../../../testutil_v2.js')

describe('Charcoal Burner', () => {
  // Card text: "Each time any player (including you) plays or builds a baking
  // improvement, you get 1 wood and 1 food."

  test('gives 1 wood and 1 food when another player builds a fireplace', () => {
    // micah builds Fireplace (2 clay) which has canBake
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['charcoal-burner-c137'],
        wood: 0,
        food: 0,
      },
      micah: {
        clay: 2,
        food: 10,
      },
    })
    game.run()

    // micah builds Fireplace (2 clay)
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        occupations: ['charcoal-burner-c137'],
        wood: 1,
        food: 1,
      },
      micah: {
        majorImprovements: ['fireplace-2'],
        food: 10,
      },
    })
  })

  test('gives 1 wood and 1 food when owner builds a baking improvement', () => {
    // dennis builds Fireplace (2 clay) himself
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['charcoal-burner-c137'],
        clay: 2,
        wood: 0,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        occupations: ['charcoal-burner-c137'],
        majorImprovements: ['fireplace-2'],
        wood: 1,
        food: 1,
      },
    })
  })
})
