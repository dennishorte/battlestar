const t = require('../../../testutil_v2.js')

describe('Kindling Gatherer', () => {
  test('gives 1 wood when getting food from Day Laborer', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['kindling-gatherer-e118'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer') // gives 2 food → triggers Kindling Gatherer

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        wood: 1, // from Kindling Gatherer
        occupations: ['kindling-gatherer-e118'],
      },
    })
  })
})
