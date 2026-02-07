const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Remodeling (C005)', () => {
  test('gives clay for clay rooms and major improvements', () => {
    const card = res.getCardById('remodeling-c005')
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        roomType: 'clay',
        farmyard: { rooms: 3 },
        majorImprovements: ['fireplace-2', 'well'],
      },
    })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.clay = 0

    card.onPlay(game, dennis)

    // 3 clay rooms + 2 major improvements = 5 clay
    expect(dennis.clay).toBe(5)
  })

  test('gives no clay for non-clay rooms', () => {
    const card = res.getCardById('remodeling-c005')
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        roomType: 'wood',
        farmyard: { rooms: 3 },
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.clay = 0

    card.onPlay(game, dennis)

    // 0 clay rooms + 1 major improvement = 1 clay
    expect(dennis.clay).toBe(1)
  })
})
