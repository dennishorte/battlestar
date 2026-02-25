const t = require('../../../testutil_v2.js')

describe("Basketmaker's Workshop", () => {
  test('bonus points based on reed count', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['basketmakers-workshop'],
        reed: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const scoreWith = dennis.calculateScore()

    // Remove basketmakers-workshop and recalculate
    const playerZone = game.zones.byPlayer(dennis, 'majorImprovements')
    const commonZone = game.zones.byId('common.majorImprovements')
    for (const card of playerZone.cardlist()) {
      card.moveTo(commonZone)
    }
    const scoreWithout = dennis.calculateScore()

    // basketmaker's: 2 VP + 3 bonus (5+ reed) = 5 point delta
    expect(scoreWith - scoreWithout).toBe(5)
  })
})
