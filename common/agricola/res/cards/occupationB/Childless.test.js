const t = require('../../../testutil_v2.js')

describe('Childless', () => {
  // Card text: "At the start of each round, if you have at least 3 rooms
  // but only 2 people, you get 1 food and 1 crop of your choice."
  // Uses onRoundStart. Card is 1+ players.

  test('gives 1 food and choice of grain or vegetable with 3+ rooms and 2 people', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['childless-b114'],
        farmyard: { rooms: [{ row: 2, col: 0 }] },  // 3 rooms
      },
    })
    game.run()

    // Childless offers grain or vegetable
    t.choose(game, 'Take 1 grain')

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 3,   // 1 from Childless + 2 from Day Laborer
        grain: 1,  // from Childless choice
        occupations: ['childless-b114'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger with only 2 rooms', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['childless-b114'],
      },
    })
    game.run()

    // No Childless offer — go straight to action
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 0,
        occupations: ['childless-b114'],
      },
    })
  })

  test('does not trigger with 3+ people', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['childless-b114'],
        familyMembers: 3,
        farmyard: { rooms: [{ row: 2, col: 0 }] },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 0,
        familyMembers: 3,
        occupations: ['childless-b114'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
