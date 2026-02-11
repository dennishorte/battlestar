const t = require('../../../testutil_v2.js')

describe('Baseboards', () => {
  test('gives 1 wood per room on play', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['baseboards-a004'],
        food: 2,
        grain: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Baseboards')

    // 2 rooms (default), 2 people → 2 wood (no bonus)
    t.testBoard(game, {
      dennis: {
        food: 1, // 2 - 2 (cost) + 1 (Meeting Place)
        wood: 2,
        hand: [],
        minorImprovements: ['baseboards-a004'],
      },
    })
  })

  test('gives bonus wood when rooms exceed people', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['baseboards-a004'],
        food: 2,
        grain: 1,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Baseboards')

    // 3 rooms, 2 people → 3 + 1 = 4 wood
    t.testBoard(game, {
      dennis: {
        food: 1,
        wood: 4,
        hand: [],
        minorImprovements: ['baseboards-a004'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
