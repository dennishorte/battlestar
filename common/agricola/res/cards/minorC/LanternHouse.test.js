const t = require('../../../testutil_v2.js')

describe('Lantern House', () => {
  test('scores 7 VP with no cards in hand', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['lantern-house-c035'],
        hand: [],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -7,
        minorImprovements: ['lantern-house-c035'],
      },
    })
  })

  test('penalizes 1 VP per card in hand', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['lantern-house-c035'],
        hand: ['test-minor-1', 'test-minor-2', 'test-minor-3'],
      },
    })
    game.run()

    // vps: 7, getEndGamePoints: -3 (3 cards in hand) = net 4 bonus
    t.testBoard(game, {
      dennis: {
        score: -10,
        minorImprovements: ['lantern-house-c035'],
        hand: ['test-minor-1', 'test-minor-2', 'test-minor-3'],
      },
    })
  })
})
