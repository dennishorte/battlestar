const t = require('../../../testutil_v2.js')

describe('Collier', () => {
  // Card text: "Each time after you use the 'Clay Pit' accumulation space,
  // you get 1 reed and 1 wood. With 3 or more players, you get 1 additional
  // wood on the 'Hollow' accumulation space."
  // Card is 3+ players.

  test('Clay Pit gives 1 reed and 1 wood bonus', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['collier-b144'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1,  // from Clay Pit
        reed: 1,  // bonus from Collier
        wood: 1,  // bonus from Collier
        occupations: ['collier-b144'],
      },
    })
  })

  test('Clay Pit in 3+ player game adds 1 wood to Hollow', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['collier-b144'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    // Hollow accumulates 1 clay per round for 3p. At round 2 (default),
    // Hollow has 1 accumulated. Collier adds +1, making it 2.
    // micah takes Hollow and gets 2 clay.
    t.choose(game, 'Hollow')  // micah takes Hollow

    t.testBoard(game, {
      dennis: {
        clay: 1,
        reed: 1,
        wood: 1,
        occupations: ['collier-b144'],
      },
      micah: {
        clay: 2,  // 1 accumulated clay + 1 from Collier
      },
    })
  })

  test('does not trigger on non-Clay Pit actions', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['collier-b144'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3,  // from Forest only, no Collier bonus
        occupations: ['collier-b144'],
      },
    })
  })
})
