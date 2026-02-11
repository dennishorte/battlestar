const t = require('../../../testutil_v2.js')

describe('Wage', () => {
  test('gives 2 food with no major improvements', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wage-b007'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Wage')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from Meeting Place + 2 from Wage
        minorImprovements: ['wage-b007'],
      },
    })
  })

  test('gives extra food for bottom-row major improvements', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wage-b007'],
        majorImprovements: ['joinery', 'pottery'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Wage')

    t.testBoard(game, {
      dennis: {
        food: 5, // 1 from Meeting Place + 2 base + 2 for joinery and pottery
        minorImprovements: ['wage-b007'],
        majorImprovements: ['joinery', 'pottery'],
      },
    })
  })

  test('does not count top-row major improvements', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wage-b007'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Wage')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from Meeting Place + 2 base, no bonus for fireplace
        minorImprovements: ['wage-b007'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
