const t = require('../../../testutil_v2.js')

describe('Scullery', () => {
  test('gives 1 food at round start in wood house', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['scullery-b057'],
        roomType: 'wood',
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from Scullery (round start) + 2 from Day Laborer
        minorImprovements: ['scullery-b057'],
      },
    })
  })

  test('no food at round start in clay house', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['scullery-b057'],
        roomType: 'clay',
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2, // only from Day Laborer, no Scullery bonus
        roomType: 'clay',
        minorImprovements: ['scullery-b057'],
      },
    })
  })
})
