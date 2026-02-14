const t = require('../../../testutil_v2.js')

describe('Hedge Keeper', () => {
  test('modifyFenceCost reduces fence cost by 3 for a single-space pasture', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      dennis: {
        occupations: ['hedge-keeper-a088'],
        wood: 1, // 4 fences needed for corner space, 3 free → pay 1 wood
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // After building, 0 wood remaining → buildFences auto-exits

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['hedge-keeper-a088'],
        wood: 0, // 1 - 1 (4 fences, 3 free from Hedge Keeper, 1 paid)
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          fences: 4,
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('modifyFenceCost makes first 3 fences free for a 2-space pasture', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      dennis: {
        occupations: ['hedge-keeper-a088'],
        wood: 3, // 6 fences needed for 2-space pasture, 3 free → pay 3 wood
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] })
    // After building, 0 wood remaining → buildFences auto-exits

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        occupations: ['hedge-keeper-a088'],
        wood: 0, // 3 - 3 (6 fences, 3 free from Hedge Keeper, 3 paid)
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
          fences: 6,
        },
        score: dennis.calculateScore(),
      },
    })
  })

  test('without Hedge Keeper, same pasture costs more wood', () => {
    // Control test: verify the discount actually saves wood
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      dennis: {
        wood: 4, // Full cost: 4 fences for single-space pasture
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })

    const dennis = game.players.byName('dennis')
    t.testBoard(game, {
      dennis: {
        wood: 0, // 4 - 4 (full cost, no discount)
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          fences: 4,
        },
        score: dennis.calculateScore(),
      },
    })
  })
})
