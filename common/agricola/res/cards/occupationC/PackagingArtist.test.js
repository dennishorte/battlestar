const t = require('../../../testutil_v2.js')

describe('Packaging Artist', () => {
  // Card text: "When you play this card, you immediately get 1 grain.
  // Each time you get a 'Minor Improvement' action, you can take a
  // 'Bake Bread' action instead."

  test('onPlay gives 1 grain', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['packaging-artist-c140'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Packaging Artist')

    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 1,
        occupations: ['packaging-artist-c140'],
      },
    })
  })
})
