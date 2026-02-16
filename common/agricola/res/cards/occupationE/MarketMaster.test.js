const t = require('../../../testutil_v2.js')

describe('Market Master', () => {
  // Traveling Players is a 4-player action space, so use numPlayers: 4
  test('offers to play occupation when last person placed on Traveling Players', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['market-master-e131'],
        hand: ['test-occupation-1'],
        food: 2, // 1 for occ cost via MarketMaster
      },
    })
    game.run()

    // Dennis's first action (not last person)
    t.choose(game, 'Day Laborer')  // dennis (worker 1 of 2)
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // scott
    t.choose(game, 'Clay Pit')     // eliya

    // Dennis's second action (last person) on Traveling Players
    t.choose(game, 'Traveling Players') // dennis (worker 2 of 2, last worker)
    // MarketMaster triggers -> offerPlayOccupation with cost 1 food
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 4, // 2 + 2 (Day Laborer) + 1 (Traveling Players round 2) - 1 (occ cost)
        occupations: ['market-master-e131', 'test-occupation-1'],
      },
    })
  })

  test('does not trigger when not the last person placed', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['market-master-e131'],
        hand: ['test-occupation-1'],
        food: 2,
      },
    })
    game.run()

    // Dennis's first action on Traveling Players (not last person)
    t.choose(game, 'Traveling Players')
    // MarketMaster should NOT trigger because this is not the last person

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 3, // 2 + 1 (Traveling Players round 2), no occ played
        hand: ['test-occupation-1'],
        occupations: ['market-master-e131'],
      },
    })
  })
})
