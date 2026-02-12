const t = require('../../../testutil_v2.js')

describe('Petrified Wood', () => {
  test('exchanges wood for stone', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['petrified-wood-d006'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        wood: 3,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Petrified Wood')
    t.choose(game, 'Exchange 2 wood for 2 stone')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        stone: 2,
        food: 1, // Meeting Place gives 1 food
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['petrified-wood-d006'],
      },
    })
  })

  test('can decline exchange', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['petrified-wood-d006'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Petrified Wood')
    t.choose(game, 'Do not exchange')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        stone: 0,
        food: 1, // Meeting Place gives 1 food
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['petrified-wood-d006'],
      },
    })
  })
})
