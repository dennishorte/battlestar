const t = require('../../../testutil_v2.js')

describe('Layabout', () => {
  // Card text: "When you play this card, you must skip the next harvest.
  // (You also do not have to feed your family that harvest.)"

  test('sets skipNextHarvest flag on play', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['layabout-c108'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Layabout')

    const dennis = game.players.byName('dennis')
    expect(dennis.skipNextHarvest).toBe(true)
  })
})
