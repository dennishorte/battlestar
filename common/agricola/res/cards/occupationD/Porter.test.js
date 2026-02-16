const t = require('../../../testutil_v2.js')

describe('Porter', () => {
  test('gives 1 extra wood and 1 food when taking 4+ wood from Forest', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 5 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['porter-d146'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 6, // 5 from Forest + 1 from Porter
        food: 1, // from Porter
        occupations: ['porter-d146'],
      },
    })
  })

  test('does not trigger when taking less than 4 of a building resource', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['porter-d146'],
      },
    })
    game.run()

    // Forest has 3 wood at round 2 (default), below the 4 threshold
    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3, // just from Forest, no Porter bonus
        occupations: ['porter-d146'],
      },
    })
  })

  test('gives 1 extra clay and 1 food when taking 4+ clay', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Clay Pit', accumulated: 4 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['porter-d146'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 5, // 4 from Clay Pit + 1 from Porter
        food: 1, // from Porter
        occupations: ['porter-d146'],
      },
    })
  })
})
