const t = require('../../../testutil_v2.js')

describe('Forest Lake Hut', () => {
  test('gives 1 wood on Fishing action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-lake-hut-a042'],
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Fishing
        wood: 1, // from Forest Lake Hut
        minorImprovements: ['forest-lake-hut-a042'],
      },
    })
  })

  test('gives 1 food on Forest action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-lake-hut-a042'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3, // from Forest
        food: 1, // from Forest Lake Hut
        minorImprovements: ['forest-lake-hut-a042'],
      },
    })
  })
})
