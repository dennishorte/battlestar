const t = require('../../../testutil_v2.js')

describe('Grain Depot', () => {
  test('schedules grain on next 2 rounds with wood payment', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['grain-depot-b065'],
        wood: 2, // card cost (primary)
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Grain Depot')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: { grain: { 2: 1, 3: 1 } },
        minorImprovements: ['grain-depot-b065'],
      },
    })
  })
})
