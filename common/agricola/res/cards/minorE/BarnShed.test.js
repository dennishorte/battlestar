const t = require('../../../testutil_v2.js')

describe('Barn Shed', () => {
  test('gives 1 grain when other player uses Forest', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['barn-shed-e066'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    // Micah goes first and takes Forest → dennis gets 1 grain from Barn Shed
    t.choose(game, 'Forest')       // micah: 3 wood → triggers Barn Shed for dennis
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Grain Seeds')  // micah
    t.choose(game, 'Clay Pit')     // dennis

    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 1, // 1 from Barn Shed (not from Grain Seeds — micah took it)
        clay: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['barn-shed-e066'],
      },
    })
  })
})
