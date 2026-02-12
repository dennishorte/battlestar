const t = require('../../../testutil_v2.js')

describe('Upholstery', () => {
  test('store 1 reed for 1 bonus point when building improvement', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['test-minor-1'],
        minorImprovements: ['upholstery-e031'],
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')
    // Upholstery triggers after building minor
    t.choose(game, 'Store 1 reed for 1 bonus point')

    t.testBoard(game, {
      dennis: {
        food: 1,  // Meeting Place
        reed: 0,  // 1 - 1 = 0
        minorImprovements: ['upholstery-e031', 'test-minor-1'],
      },
    })

    // Check scoring: 1 stored reed = 1 bonus point
    const dennis = game.players.byName('dennis')
    const card = dennis.cards.byId('upholstery-e031')
    expect(card.callHook('getEndGamePoints', dennis)).toBe(1)
  })
})
