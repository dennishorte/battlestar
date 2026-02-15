const t = require('../../../testutil_v2.js')

describe('Plumber', () => {
  // Card text: "Each time after you use the 'Major Improvement' action
  // space, you can take a 'Renovation' action for 2 clay or 2 stone less."
  // Card is 1+ players.

  test('Major Improvement triggers discounted renovation offer', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plumber-b128'],
        clay: 1,
        reed: 1,
        // Default: wood house, 2 rooms at (0,0) and (1,0)
        // Renovate to clay costs 2 clay + 1 reed normally
        // With Plumber discount: max(0, 2-2) clay + 1 reed = 0 clay + 1 reed
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    // No affordable improvements → auto-skips
    // Plumber offers discounted renovation
    t.choose(game, 'Renovate (discounted)')

    t.testBoard(game, {
      dennis: {
        clay: 1,  // unchanged (0 clay cost)
        reed: 0,  // 1 - 1
        roomType: 'clay',
        occupations: ['plumber-b128'],
      },
    })
  })

  test('player can skip renovation', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plumber-b128'],
        clay: 1,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    // Skip renovation
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        clay: 1,
        reed: 1,
        roomType: 'wood',
        occupations: ['plumber-b128'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plumber-b128'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['plumber-b128'],
      },
    })
  })
})
