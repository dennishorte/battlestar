const t = require('../../../testutil_v2.js')

describe('Cooking Hearth (cooking-hearth-4)', () => {
  test('upgrade from Fireplace', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 4,
        majorImprovements: ['fireplace-2'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Cooking Hearth (cooking-hearth-4)')

    t.testBoard(game, {
      dennis: {
        clay: 4, // Upgrade is free (return old card)
        majorImprovements: ['cooking-hearth-4'],
      },
    })

    // Fireplace should be back in common zone
    const commonMajorZone = game.zones.byId('common.majorImprovements')
    const commonCards = commonMajorZone.cardlist().map(c => c.id)
    expect(commonCards).toContain('fireplace-2')
  })
})
