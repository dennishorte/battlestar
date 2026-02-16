const t = require('../../../testutil_v2.js')

describe('Craftsmanship Promoter', () => {
  test('onPlay gives 1 stone', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        hand: ['craftsmanship-promoter-d131'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Craftsmanship Promoter')

    t.testBoard(game, {
      dennis: {
        stone: 1,
        occupations: ['craftsmanship-promoter-d131'],
      },
    })
  })

  test('allows building pottery on Meeting Place minor improvement action', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['craftsmanship-promoter-d131'],
        clay: 2,
        stone: 2,
      },
    })
    game.run()

    // Meeting Place gives minor improvement action; Craftsmanship Promoter allows specific majors
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Major Improvement.Pottery (pottery)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place gives 1 food
        occupations: ['craftsmanship-promoter-d131'],
        majorImprovements: ['pottery'],
      },
    })
  })
})
