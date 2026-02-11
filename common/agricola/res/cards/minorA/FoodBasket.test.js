const t = require('../../../testutil_v2.js')

describe('Food Basket', () => {
  test('gives 1 grain and 1 vegetable on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['food-basket-a008'],
        reed: 1, // cost of Food Basket
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['test-minor-1', 'test-minor-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Food Basket')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        grain: 1,
        vegetables: 1,
        hand: [],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'food-basket-a008'],
      },
    })
  })
})
