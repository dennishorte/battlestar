const t = require('../../../testutil_v2.js')

describe('Mud Wallower', () => {
  // Card text: "Each time you use an accumulation space, place 1 clay on
  // this card. Exchange 4 clay for 1 wild boar held by this card."

  test('accumulates clay when using accumulation spaces', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['mud-wallower-c148'],
      },
    })
    game.run()

    // dennis takes Forest (accumulation space) → 1 clay on card
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['mud-wallower-c148'],
        wood: 3,
      },
    })
  })
})
