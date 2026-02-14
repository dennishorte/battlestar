const t = require('../../../testutil_v2.js')

describe('Ropemaker', () => {
  test('onHarvestEnd gives 1 reed at end of each harvest', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['ropemaker-a145'],
        food: 8,
        reed: 0,
      },
      micah: { food: 8 },
      scott: { food: 8 },
    })
    game.run()

    // Play through all 6 actions (3 players × 2 workers)
    t.choose(game, 'Day Laborer')  // dennis turn 1
    t.choose(game, 'Forest')       // micah turn 1
    t.choose(game, 'Reed Bank')    // scott turn 1
    t.choose(game, 'Grain Seeds')  // dennis turn 2
    t.choose(game, 'Clay Pit')     // micah turn 2
    t.choose(game, 'Fishing')       // scott turn 2

    // Harvest: onHarvestEnd fires → Ropemaker gives +1 reed
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        reed: 1, // 0 + 1 (Ropemaker)
        grain: 1, // 0 + 1 (Grain Seeds)
        food: 6, // 8 + 2 (Day Laborer) - 4 (feeding)
        occupations: ['ropemaker-a145'],
      },
    })
  })

})
