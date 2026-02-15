const t = require('../../../testutil_v2.js')

describe('Food Distributor', () => {
  // Card text: "When you play this card, you immediately get 1 grain and, at the
  // start of this returning home phase, an amount of food equal to the number of
  // occupied action space cards."

  test('onPlay gives grain and food at return home', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['food-distributor-c155'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Dennis plays Food Distributor (gets 1 grain immediately)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Food Distributor')

    // Other players take actions to fill out the round
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Forest')       // scott
    t.choose(game, 'Clay Pit')     // eliya

    // Second round of actions
    t.choose(game, 'Grain Seeds')         // dennis
    t.choose(game, 'Grain Utilization')   // micah
    t.choose(game, 'Copse')              // scott
    t.choose(game, 'Grove')              // eliya

    // Return home fires — dennis gets food for occupied action spaces
    // In round 2 with 4 players x 2 workers = 8 occupied action spaces
    t.testBoard(game, {
      dennis: {
        food: 18,  // 10 start + 8 from FoodDistributor (8 occupied spaces)
        grain: 2,  // 1 from Food Distributor + 1 from Grain Seeds
        occupations: ['food-distributor-c155'],
      },
    })
  })
})
