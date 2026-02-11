const t = require('../../../testutil_v2.js')

describe('Gift Basket', () => {
  test('gives 1 vegetable with 2 rooms', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        hand: ['gift-basket-b073'],
        reed: 1, // card cost
      },
    })
    game.run()

    // Dennis has default 2 rooms → gets 1 vegetable
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Gift Basket')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        vegetables: 1, // from Gift Basket (2 rooms)
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['gift-basket-b073'],
      },
    })
  })

  test('gives 1 food with 3 rooms', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        hand: ['gift-basket-b073'],
        reed: 1,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // +1 room = 3 total
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Gift Basket')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Gift Basket (3 rooms)
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['gift-basket-b073'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
