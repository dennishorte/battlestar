const t = require('../../../testutil_v2.js')

describe('Sleight of Hand', () => {
  test('exchange 2 building resources', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sleight-of-hand-e078'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        wood: 3,
        clay: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Sleight of Hand')
    t.choose(game, 'wood \u2192 stone')
    t.choose(game, 'wood \u2192 reed')
    t.choose(game, 'Done')

    t.testBoard(game, {
      dennis: {
        wood: 1,      // 3 - 2
        clay: 1,      // unchanged
        stone: 1,     // +1
        reed: 1,      // +1
        food: 1,      // Meeting Place
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['sleight-of-hand-e078'],
      },
    })
  })

  test('stop early when no resources left', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sleight-of-hand-e078'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Sleight of Hand')
    t.choose(game, 'wood \u2192 stone')
    // wood=0 now, but stone=1 so loop continues
    t.choose(game, 'Done')

    t.testBoard(game, {
      dennis: {
        stone: 1,
        food: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['sleight-of-hand-e078'],
      },
    })
  })
})
