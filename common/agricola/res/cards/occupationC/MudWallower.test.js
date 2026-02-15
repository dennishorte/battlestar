const t = require('../../../testutil_v2.js')

describe('Mud Wallower', () => {
  // Card text: "Each time you use an accumulation space, place 1 clay on this card.
  // Exchange 4 clay for 1 wild boar held by this card."

  test('places clay on card when using accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['mud-wallower-c148'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Forest') // dennis takes Forest (accumulation space) -> 1 clay on card

    const s = game.cardState('mud-wallower-c148')
    expect(s.clay).toBe(1)
  })
})
