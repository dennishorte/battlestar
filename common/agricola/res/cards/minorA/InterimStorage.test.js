const t = require('../../../testutil_v2.js')

describe('Interim Storage', () => {
  test('stores resources from accumulation spaces and delivers at round 7', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['interim-storage-a081'],
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Round 6: dennis plays InterimStorage via Meeting Place, then takes Clay Pit
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Interim Storage')
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis: gets 1 clay, stores 1 wood on card
    t.choose(game, 'Day Laborer')  // micah

    // Round 7 starts → onRoundStart delivers stored resources (1 wood)
    // Game pauses at round 7 work phase waiting for input
    t.testBoard(game, {
      dennis: {
        food: 9,  // 10 - 2 (card cost) + 1 (Meeting Place)
        clay: 1,  // from Clay Pit
        wood: 1,  // delivered from Interim Storage
        hand: [],
        minorImprovements: ['interim-storage-a081'],
      },
    })
  })
})
