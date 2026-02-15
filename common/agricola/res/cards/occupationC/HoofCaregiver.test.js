const t = require('../../../testutil_v2.js')

describe('Hoof Caregiver', () => {
  // Card text: "Immediately add 1 cattle from the general supply to the
  // \"Cattle Market\" accumulation space. Afterward, you get 1 grain plus
  // 1 food for each cattle on \"Cattle Market\"."

  test('onPlay gives grain and food based on cattle market', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['hoof-caregiver-c156'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 2: Cattle Market not yet revealed (stage 4, rounds 10-11).
    // addToAccumulationSpace should add 1 cattle to it, then
    // getAccumulatedResources returns that 1 cattle → 1 grain + 1 food.
    t.choose(game, 'Lessons A')
    t.choose(game, 'Hoof Caregiver')

    t.testBoard(game, {
      dennis: {
        food: 11,  // 10 + 1 food (1 cattle on market)
        grain: 1,
        occupations: ['hoof-caregiver-c156'],
      },
    })
  })
})
