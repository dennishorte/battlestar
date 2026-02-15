const t = require('../../../testutil_v2.js')

describe('Stone Importer', () => {
  // Card text: "In the breeding phase of the 1st/2nd/... harvest, you can
  // buy exactly 2 stone for 2/2/3/3/4/1 food."

  test('buys 2 stone for 2 food during 1st harvest breeding phase', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stone-importer-c124'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest → feeding (auto) → breeding → onBreedingPhaseEnd: Stone Importer
    t.choose(game, 'Buy 2 stone for 2 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['stone-importer-c124'],
        food: 6,
        stone: 2,
        grain: 1,
      },
    })
  })
})
