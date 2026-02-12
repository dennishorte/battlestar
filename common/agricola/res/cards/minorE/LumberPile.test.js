const t = require('../../../testutil_v2.js')

describe('Lumber Pile', () => {
  test('return 2 stables for 6 wood when played', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['lumber-pile-e076'],
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Lumber Pile')
    t.choose(game, 'Return 2 stables for 6 wood')

    t.testBoard(game, {
      dennis: {
        wood: 6,
        food: 1,  // Meeting Place gives 1 food
        minorImprovements: ['lumber-pile-e076'],
      },
    })
  })

  test('can skip returning stables', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['lumber-pile-e076'],
        farmyard: {
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Lumber Pile')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 1,  // Meeting Place gives 1 food
        minorImprovements: ['lumber-pile-e076'],
        farmyard: {
          stables: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})
