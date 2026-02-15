const t = require('../../../testutil_v2.js')

describe('Storehouse Keeper', () => {
  // Card text: "Each time you use the 'Resource Market' action space, you
  // also get your choice of 1 clay or 1 grain."
  // Card is 4+ players. Resource Market available in 4+ player games.

  test('Resource Market offers choice of 1 clay or 1 grain', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['storehouse-keeper-b156'],
      },
    })
    game.run()

    t.choose(game, 'Resource Market')
    // Resource Market for 4p: choose reed or stone, then get food
    t.choose(game, 'reed')
    // Storehouse Keeper offers extra resource
    t.choose(game, 'Take 1 clay')

    t.testBoard(game, {
      dennis: {
        reed: 1,   // chose reed from Resource Market
        food: 1,   // from Resource Market
        clay: 1,   // from Storehouse Keeper
        occupations: ['storehouse-keeper-b156'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['storehouse-keeper-b156'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['storehouse-keeper-b156'],
      },
    })
  })
})
