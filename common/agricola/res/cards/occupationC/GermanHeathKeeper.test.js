const t = require('../../../testutil_v2.js')

describe('German Heath Keeper', () => {
  // Card text: "Each time any player (including you) uses the 'Pig Market'
  // accumulation space, you get 1 sheep from the general supply."

  test('gives sheep when any player uses Pig Market', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['german-heath-keeper-c164'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
      micah: { food: 10 },
      scott: { food: 10 },
      valerie: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Pig Market')  // micah takes Pig Market -> dennis gets 1 sheep

    t.testBoard(game, {
      dennis: {
        food: 12,
        occupations: ['german-heath-keeper-c164'],
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
    })
  })
})
