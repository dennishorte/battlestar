const t = require('../../../testutil_v2.js')

describe('Cottar', () => {
  test('gives 1 wood or 1 clay when building a major improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cottar-e122'],
        clay: 2, // cost of Fireplace
      },
    })
    game.run()

    // Dennis builds Fireplace via Major Improvement
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Cottar fires: choose a resource
    t.choose(game, 'Take 1 wood')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        clay: 0,
        occupations: ['cottar-e122'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('can choose clay from Cottar', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cottar-e122'],
        clay: 2, // cost of Fireplace
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    t.choose(game, 'Take 1 clay')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1, // 2 - 2 (fireplace cost) + 1 (Cottar)
        occupations: ['cottar-e122'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('triggers when playing a minor improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cottar-e122'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')
    // Cottar fires
    t.choose(game, 'Take 1 wood')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        food: 1, // from Meeting Place
        occupations: ['cottar-e122'],
        minorImprovements: ['test-minor-1'],
      },
    })
  })
})
