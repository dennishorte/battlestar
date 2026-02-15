const t = require('../../../testutil_v2.js')

describe('Tree Farm Joiner', () => {
  test('onPlay schedules woodWithMinor on next 2 odd rounds', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: { hand: ['tree-farm-joiner-b096'] },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Tree Farm Joiner')

    // Round 2 when playing; next 2 odd rounds are 3, 5
    t.testBoard(game, {
      dennis: {
        occupations: ['tree-farm-joiner-b096'],
        scheduled: { woodWithMinor: [3, 5] },
      },
    })
  })

  test('onRoundStart delivers 1 wood and offers minor improvement', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['tree-farm-joiner-b096'],
        hand: ['test-minor-1'],
        wood: 0,
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      g.state.scheduledWoodWithMinor = { dennis: [3] }
    })
    game.run()

    // Round 3 start: Tree Farm Joiner delivers 1 wood and triggers buyMinorImprovement
    t.choose(game, 'Do not play a minor improvement')

    t.testBoard(game, {
      dennis: {
        occupations: ['tree-farm-joiner-b096'],
        wood: 1,
        hand: ['test-minor-1'],
      },
    })
  })
})
