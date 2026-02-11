const t = require('../../../testutil_v2.js')

describe('Brewery Pond', () => {
  test('gives 1 grain + 1 wood when using Fishing', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['brewery-pond-b040'],
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Fishing
        grain: 1, // from Brewery Pond
        wood: 1, // from Brewery Pond
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['brewery-pond-b040'],
      },
    })
  })

  test('gives 1 grain + 1 wood when using Reed Bank', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['brewery-pond-b040'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        reed: 1, // from Reed Bank
        grain: 1, // from Brewery Pond
        wood: 1, // from Brewery Pond
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['brewery-pond-b040'],
      },
    })
  })

  test('no bonus when using Day Laborer', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['brewery-pond-b040'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2, // from Day Laborer
        grain: 0, // no Brewery Pond bonus
        wood: 0, // no Brewery Pond bonus
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['brewery-pond-b040'],
      },
    })
  })
})
