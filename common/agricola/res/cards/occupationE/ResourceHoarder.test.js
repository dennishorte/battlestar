const t = require('../../../testutil_v2.js')

describe('Resource Hoarder', () => {
  test('onPlay initializes pile with correct resource order', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['resource-hoarder-e123'],
        food: 5,
      },
    })
    game.run()

    // Play Resource Hoarder
    t.choose(game, 'Lessons A')
    t.choose(game, 'Resource Hoarder')

    // Pile is set (bottom to top: stone, clay, stone, reed, wood, clay)
    const pile = game.cardState('resource-hoarder-e123').pile
    expect(pile).toEqual(['stone', 'clay', 'stone', 'reed', 'wood', 'clay'])

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 5,  // first occ is free
        occupations: ['resource-hoarder-e123'],
      },
    })
  })

})
