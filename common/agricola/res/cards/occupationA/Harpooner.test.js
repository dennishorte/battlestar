const t = require('../../../testutil_v2.js')

describe('Harpooner', () => {
  // Card is 3+ players only
  test('onAction offers pay 1 wood for food per person and 1 reed when using Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      dennis: {
        occupations: ['harpooner-a138'],
        wood: 1,
        food: 0,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    t.choose(game, 'Pay 1 wood for 2 food and 1 reed')

    t.testBoard(game, {
      dennis: {
        occupations: ['harpooner-a138'],
        wood: 0,
        food: 3, // 1 from Fishing + 2 from Harpooner (2 family)
        reed: 1,
      },
    })
  })

  test('onAction allows skipping the bonus', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Fishing', accumulated: 2 }],
      dennis: {
        occupations: ['harpooner-a138'],
        wood: 1,
        food: 0,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['harpooner-a138'],
        wood: 1,
        food: 2,
        reed: 0,
      },
    })
  })

  test('onAction does not offer bonus when player has no wood', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      dennis: {
        occupations: ['harpooner-a138'],
        wood: 0,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    // No Harpooner choice — only action completion

    t.testBoard(game, {
      dennis: {
        occupations: ['harpooner-a138'],
        wood: 0,
        food: 1,
      },
    })
  })
})
