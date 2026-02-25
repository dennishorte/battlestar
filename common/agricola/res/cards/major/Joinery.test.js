const t = require('../../../testutil_v2.js')

describe('Joinery', () => {
  test('bonus points based on wood count', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['joinery'],
        wood: 7,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const scoreWith = dennis.calculateScore()

    // Remove joinery and recalculate
    const playerZone = game.zones.byPlayer(dennis, 'majorImprovements')
    const commonZone = game.zones.byId('common.majorImprovements')
    for (const card of playerZone.cardlist()) {
      card.moveTo(commonZone)
    }
    const scoreWithout = dennis.calculateScore()

    // joinery: 2 VP + 3 bonus (7+ wood) = 5 point delta
    expect(scoreWith - scoreWithout).toBe(5)
  })
})
