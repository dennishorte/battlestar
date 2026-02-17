const t = require('../../../testutil_v2.js')

describe('Firewood', () => {
  test('accumulates 1 wood on card per returning home phase', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['firewood-c075'],
      },
    })
    game.run()

    // Play 4 actions to complete round 2
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // After return home phase: 1 wood placed on Firewood card
    // Custom card state: firewoodWood has no testBoard equivalent
    const dennis = game.players.byName('dennis')
    expect(dennis.firewoodWood).toBe(1)
  })
})
