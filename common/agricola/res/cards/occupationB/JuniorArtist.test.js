const t = require('../../../testutil_v2.js')

describe('Junior Artist', () => {
  // Card text: "Each time after you use the 'Day Laborer' action space,
  // you can pay 1 food to use an unoccupied 'Traveling Players' or
  // 'Lessons' action space with the same person."
  // Card is 3+ players.

  test('Day Laborer: pay 1 food to use Lessons B', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['junior-artist-b152'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    // Junior Artist offers Lessons A and Lessons B (3p has both)
    t.choose(game, 'Use Lessons B')
    // Lessons B → play an occupation (no occupations left in hand, so nothing played)

    t.testBoard(game, {
      dennis: {
        food: 6,  // 5 + 2 DL - 1 JA cost = 6 (no occupation played from Lessons)
        occupations: ['junior-artist-b152'],
      },
    })
  })

  test('player can skip the offer', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['junior-artist-b152'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 7,  // 5 + 2 Day Laborer
        occupations: ['junior-artist-b152'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['junior-artist-b152'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        food: 5,
        occupations: ['junior-artist-b152'],
      },
    })
  })
})
