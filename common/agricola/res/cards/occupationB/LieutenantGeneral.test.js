const t = require('../../../testutil_v2.js')

describe('Lieutenant General', () => {
  // Card text: "For each field tile that another player places next to an
  // existing field tile, you get 1 food from the general supply. In round
  // 14, you get 1 grain instead."
  // Uses onAnyAction hook for plow actions. Card is 4+ players.

  test('gives 1 food when another player plows adjacent to existing field', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'micah',
      dennis: {
        occupations: ['lieutenant-general-b159'],
      },
      micah: {
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // micah plows a field (Farmland) — micah already has 1 field,
    // new field must be adjacent → LieutenantGeneral triggers
    t.choose(game, 'Farmland')
    t.choose(game, '2,1')  // select plow location

    t.testBoard(game, {
      dennis: {
        occupations: ['lieutenant-general-b159'],
        food: 1,  // 0 + 1 from Lieutenant General
      },
    })
  })

  test('does not trigger when owner plows', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lieutenant-general-b159'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // dennis plows (own action) → no trigger
    t.choose(game, 'Farmland')
    t.choose(game, '2,1')  // select plow location

    t.testBoard(game, {
      dennis: {
        occupations: ['lieutenant-general-b159'],
        food: 0,  // no bonus from own plowing
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('does not trigger when another player plows their first field', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'micah',
      dennis: {
        occupations: ['lieutenant-general-b159'],
      },
      // micah has no existing fields — first field not adjacent to anything
    })
    game.run()

    t.choose(game, 'Farmland')  // micah plows first field
    t.choose(game, '2,0')       // select plow location

    t.testBoard(game, {
      dennis: {
        occupations: ['lieutenant-general-b159'],
        food: 0,  // no bonus — first field (1 total), not adjacent to existing
      },
    })
  })
})
