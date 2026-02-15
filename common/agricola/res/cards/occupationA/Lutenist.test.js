const t = require('../../../testutil_v2.js')

describe('Lutenist', () => {
  test('onAnyAction gives 1 food and 1 wood, then offers buy 1 vegetable for 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['lutenist-a160'],
        food: 1,
      },
      micah: { food: 5 },
      scott: { food: 5 },
      eliya: { food: 5 },
    })
    game.run()

    t.choose(game, 'Traveling Players')   // micah → dennis gets +1 food +1 wood, then offer
    t.choose(game, 'Buy 1 vegetable for 2 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['lutenist-a160'],
        food: 0,
        wood: 1,
        vegetables: 1,
      },
      micah: { food: 6 },
    })
  })

  test('allows skip on vegetable purchase', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['lutenist-a160'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Traveling Players')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['lutenist-a160'],
        food: 6,
        wood: 1,
        vegetables: 0,
      },
      micah: { food: 1 },
    })
  })
})
