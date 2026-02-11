const t = require('../../../testutil_v2.js')

describe('Food Chest', () => {
  test('gives 4 food when played on Major Improvement action space', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['food-chest-b059'],
        wood: 1, // card cost
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Food Chest')

    t.testBoard(game, {
      dennis: {
        food: 4,
        minorImprovements: ['food-chest-b059'],
      },
    })
  })

  test('gives 2 food when played on other action space', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['food-chest-b059'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Food Chest')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from Meeting Place + 2 from Food Chest
        minorImprovements: ['food-chest-b059'],
      },
    })
  })
})
