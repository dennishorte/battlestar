const t = require('../../../testutil_v2.js')

describe('Butler', () => {
  // Card text: "If you play this card in round 11 or before, during scoring,
  // you get 4 bonus points if you then have more rooms than people."

  test('gives 4 BP when played early and rooms > people', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['butler-c100'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Butler')

    // Card state should record that it was played early
    expect(game.cardState('butler-c100').playedEarly).toBe(true)
  })
})
