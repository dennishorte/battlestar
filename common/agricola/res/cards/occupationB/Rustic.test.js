const t = require('../../../testutil_v2.js')

describe('Rustic', () => {
  // Card text: "For each clay room you build, you get 2 food and 1 bonus
  // point. (This does not apply to stone rooms and renovated wood rooms)."
  // Uses onBuildRoom hook. Card is 1+ players.

  test('building a clay room gives 2 food and 1 bonus point', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['rustic-b111'],
        roomType: 'clay',
        clay: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        food: 2,  // from Rustic
        bonusPoints: 1,
        occupations: ['rustic-b111'],
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not trigger on wood rooms', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['rustic-b111'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        food: 0,
        bonusPoints: 0,
        occupations: ['rustic-b111'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not trigger on renovation to clay', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement', 'House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['rustic-b111'],
        clay: 5,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Do not play an improvement')

    t.testBoard(game, {
      dennis: {
        food: 0,
        bonusPoints: 0,
        clay: 3,  // 5 - 2 (renovation cost for 2 rooms)
        occupations: ['rustic-b111'],
        roomType: 'clay',
      },
    })
  })
})
