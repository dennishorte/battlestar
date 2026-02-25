const t = require('../../../testutil_v2.js')

describe('Pottery', () => {
  test('bonus points based on clay count', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['pottery'],
        clay: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const scoreWith = dennis.calculateScore()

    // Remove pottery and recalculate
    const playerZone = game.zones.byPlayer(dennis, 'majorImprovements')
    const commonZone = game.zones.byId('common.majorImprovements')
    for (const card of playerZone.cardlist()) {
      card.moveTo(commonZone)
    }
    const scoreWithout = dennis.calculateScore()

    // pottery: 2 VP + 2 bonus (5-6 clay) = 4 point delta
    expect(scoreWith - scoreWithout).toBe(4)
  })
})
