const t = require('../../../testutil_v2.js')

describe('Open Air Farmer', () => {
  // Card text: "When you play this card, if you have at least 3 stables in your
  // supply, remove 3 stables in your supply from play and build a pasture covering
  // 2 farmyard spaces. You only need to pay a total of 2 wood for the fences."
  // Card is 3+ players.

  test('onPlay with 3 stables in supply builds 2-space pasture for 2 wood', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['open-air-farmer-b149'],
        wood: 5,
        // 0 stables built → 4 in supply ≥ 3
        farmyard: {
          stables: [{ row: 2, col: 0 }],  // 1 built → 3 in supply
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Open Air Farmer')
    // Select 2 adjacent spaces for pasture
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] })

    t.testBoard(game, {
      dennis: {
        occupations: ['open-air-farmer-b149'],
        wood: 3,  // 5 - 2 = 3
        farmyard: {
          stables: [{ row: 2, col: 0 }],
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
  })

  test('onPlay with fewer than 3 stables in supply does nothing', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['open-air-farmer-b149'],
        wood: 5,
        farmyard: {
          stables: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],  // 3 built → 1 in supply
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Open Air Farmer')
    // No pasture prompt since only 1 stable in supply

    t.testBoard(game, {
      dennis: {
        occupations: ['open-air-farmer-b149'],
        wood: 5,  // unchanged
        farmyard: {
          stables: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
        },
      },
    })
  })

  test('removed stables reduce max stables available for future builds', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['open-air-farmer-b149'],
        wood: 5,
        // 0 stables built → 4 in supply ≥ 3
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Open Air Farmer')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] })

    // After playing: 3 stables removed from supply → max stables = 4 - 3 = 1
    // Player has 0 built stables → can build 1 more at most
    const dennis = game.players.byName('dennis')
    expect(dennis.removedStables).toBe(3)
    expect(dennis.canBuildStable(2, 0)).toBe(true)
    // After building 1, should not be able to build another
  })
})
