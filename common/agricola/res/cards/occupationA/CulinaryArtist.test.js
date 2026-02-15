const t = require('../../../testutil_v2.js')

describe('Culinary Artist', () => {
  test('onAnyAction offers to exchange 1 grain for 4 food when another uses Traveling Players', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['culinary-artist-a158'],
        grain: 2,
      },
      micah: { food: 5 },
      scott: { food: 5 },
      eliya: { food: 5 },
    })
    game.run()

    t.choose(game, 'Traveling Players')
    t.choose(game, 'Exchange 1 grain for 4 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['culinary-artist-a158'],
        grain: 1,
        food: 4,
      },
      micah: { food: 6 },
    })
  })

  test('allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['culinary-artist-a158'],
        grain: 1,
      },
    })
    game.run()

    t.choose(game, 'Traveling Players')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: { occupations: ['culinary-artist-a158'], grain: 1 },
      micah: { food: 1 },
    })
  })
})
