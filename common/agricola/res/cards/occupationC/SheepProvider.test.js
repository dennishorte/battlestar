const t = require('../../../testutil_v2.js')

describe('Sheep Provider', () => {
  // Card text: "Each time any player (including you) uses the 'Sheep Market'
  // accumulation space, you get 1 grain."

  test('gives grain when any player uses Sheep Market', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sheep-provider-c141'],
        food: 10,
      },
      micah: {
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Sheep Market') // micah -> dennis gets 1 grain

    t.testBoard(game, {
      dennis: {
        food: 12,
        grain: 1,
        occupations: ['sheep-provider-c141'],
      },
    })
  })
})
