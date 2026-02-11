const t = require('../../../testutil_v2.js')

describe('Shelter', () => {
  test('builds free stable in single-space pasture via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['shelter-a001'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
    game.run()

    // Dennis takes Meeting Place, plays Shelter
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Shelter')
    // onPlay fires: offer to build stable in single-space pasture
    t.choose(game, 'Build stable at 0,4')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        hand: [],
        minorImprovements: ['shelter-a001'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          stables: [{ row: 0, col: 4 }],
        },
      },
    })
  })

  test('can skip building stable', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['shelter-a001'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Shelter')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 1,
        hand: [],
        minorImprovements: ['shelter-a001'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
  })
})
