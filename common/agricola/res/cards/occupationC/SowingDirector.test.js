const t = require('../../../testutil_v2.js')

describe('Sowing Director', () => {
  // Card text: "Each time after another player uses the 'Grain Utilization'
  // action space, you get a 'Sow' action."

  test('gives sow action when another player uses Grain Utilization', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['sowing-director-c151'],
        grain: 2,
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // micah takes Grain Utilization (no fields/grain, auto-completes)
    // Then SowingDirector triggers: dennis gets Sow
    t.choose(game, 'Grain Utilization')

    // dennis sows grain in his field
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
    t.choose(game, 'Done Sowing')

    t.testBoard(game, {
      dennis: {
        occupations: ['sowing-director-c151'],
        grain: 1,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }, { row: 2, col: 1 }],
        },
      },
    })
  })
})
