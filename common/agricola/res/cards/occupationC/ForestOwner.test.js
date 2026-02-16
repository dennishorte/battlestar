const t = require('../../../testutil_v2.js')

describe('Forest Owner', () => {
  // Card text: "This card is an action space for all. If another player uses it,
  // they get 3 wood and give you 1 wood. If you use it, you get 4 wood."

  test('owner uses action space for 4 wood', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-owner-c162'],
        wood: 0,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.run()

    t.choose(game, 'Forest Owner')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-owner-c162'],
        wood: 4,
      },
    })
  })

  test('non-owner uses action space for 3 wood, owner gets 1 wood', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['forest-owner-c162'],
        wood: 0,
      },
      micah: { wood: 0, food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.run()

    // micah uses Forest Owner → micah gets 3 wood, dennis gets 1 wood
    t.choose(game, 'Forest Owner')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-owner-c162'],
        wood: 1,
      },
      micah: {
        wood: 3,
        food: 10,
      },
    })
  })
})
