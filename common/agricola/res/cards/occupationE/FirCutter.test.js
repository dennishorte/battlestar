const t = require('../../../testutil_v2.js')

describe('Fir Cutter', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['fir-cutter-e116'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Fir Cutter')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // from Fir Cutter onPlay
        occupations: ['fir-cutter-e116'],
      },
    })
  })
})
