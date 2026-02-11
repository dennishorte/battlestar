const t = require('../../../testutil_v2.js')

describe('Walking Boots', () => {
  test('temporary worker gives extra action this round', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['walking-boots-b022'],
        food: 0,
      },
    })
    game.run()

    // Dennis: play Walking Boots via Meeting Place → gets 2 food + temp worker
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Walking Boots')
    // Micah: action 1
    t.choose(game, 'Day Laborer')
    // Dennis: action 2 (normal worker)
    t.choose(game, 'Forest')
    // Micah: action 2
    t.choose(game, 'Clay Pit')
    // Dennis: action 3 (temporary worker from Walking Boots)
    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 from Walking Boots + 1 from Meeting Place
        wood: 3, // from Forest
        reed: 1, // from Reed Bank
        minorImprovements: ['walking-boots-b022'],
      },
    })
  })

  test('temporary worker is gone next round', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['walking-boots-b022'],
        food: 0,
      },
    })
    game.run()

    // Round 1: Dennis plays Walking Boots (5 actions total: 3 Dennis, 2 Micah)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Walking Boots')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Round 2: Normal 4 actions (2 each), Dennis is still first player
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Fishing')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      round: 3,
      dennis: {
        food: 5, // R1: 2 (boots) + 1 (meeting) + R2: 2 (day laborer)
        wood: 3, // from R1 Forest
        reed: 1, // from R1 Reed Bank
        grain: 1, // from R2 Grain Seeds
        minorImprovements: ['walking-boots-b022'],
      },
    })
  })
})
