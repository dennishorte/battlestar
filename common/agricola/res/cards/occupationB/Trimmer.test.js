const t = require('../../../testutil_v2.js')

describe('Trimmer', () => {
  // Card text: "Each time after you enclose at least one farmyard space,
  // you get 2 stone. (Subdividing an existing pasture does not count.)"
  // Uses onBuildPasture hook. Card is 1+ players.

  test('gives 2 stone when building a pasture', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['trimmer-b124'],
        wood: 4,  // 4 fences for a 1-space corner pasture
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // 4 wood used → 0 remaining → fencing auto-exits

    t.testBoard(game, {
      dennis: {
        occupations: ['trimmer-b124'],
        wood: 0,    // 4 - 4 fences
        stone: 2,   // 0 + 2 from Trimmer
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
  })

  test('gives 2 stone for each pasture built', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['trimmer-b124'],
        wood: 10,  // enough for two adjacent pastures
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    // Build first pasture (corner: 4 fences)
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // Build second pasture (adjacent: shares 1 fence with first)
    t.choose(game, 'Build another pasture')
    t.action(game, 'build-pasture', { spaces: [{ row: 1, col: 4 }] })

    t.testBoard(game, {
      dennis: {
        occupations: ['trimmer-b124'],
        wood: 3,    // 10 - 7 fences (4 + 3 for adjacent pastures)
        stone: 4,   // 2 + 2 from Trimmer (one per pasture)
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 4 }] },
            { spaces: [{ row: 1, col: 4 }] },
          ],
        },
      },
    })
  })
})
