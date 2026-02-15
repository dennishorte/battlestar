const t = require('../../../testutil_v2.js')

describe('Buyer', () => {
  test('onAnyAction offers to pay 1 food to get 1 reed when another player uses Reed Bank', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Reed Bank', accumulated: 1 }],
      dennis: {
        occupations: ['buyer-a156'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')   // micah uses Reed Bank → Buyer offers dennis
    t.choose(game, 'Pay 1 food to micah to get 1 reed')

    t.testBoard(game, {
      dennis: {
        occupations: ['buyer-a156'],
        food: 4,
        reed: 1,
      },
      micah: { reed: 1, food: 1 },
    })
  })

  test('allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Reed Bank', accumulated: 1 }],
      dennis: {
        occupations: ['buyer-a156'],
        food: 3,
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: { occupations: ['buyer-a156'], food: 3, reed: 0 },
      micah: { reed: 1 },
    })
  })
})
