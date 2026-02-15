const t = require('../../../testutil_v2.js')

describe('Furniture Carpenter', () => {
  // Card text: "Each harvest, if any player (including you) owns the Joinery
  // or an upgrade thereof, you can buy exactly 1 bonus point for 2 food."
  // Uses onHarvest hook. Card is 1+ players.

  test('offers bonus point during harvest when Joinery is owned', () => {
    const game = t.fixture({ numPlayers: 2 })
    // Round 4 = first harvest
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['furniture-carpenter-b101'],
        food: 5,
        majorImprovements: ['joinery'],
      },
    })
    game.run()

    // Place all 4 workers to reach harvest
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: Furniture Carpenter offers bonus point
    t.choose(game, 'Buy 1 bonus point for 2 food')
    // Feeding is auto (5 + 2 - 2 = 5 food, needs 4 → auto-feeds)

    t.testBoard(game, {
      dennis: {
        food: 1,  // 5 + 2 - 2 - 4
        grain: 1,
        bonusPoints: 1,
        occupations: ['furniture-carpenter-b101'],
        majorImprovements: ['joinery'],
      },
    })
  })

  test('does not offer when no one owns Joinery', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['furniture-carpenter-b101'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // No Furniture Carpenter offer — auto-feeds and moves to next round
    t.testBoard(game, {
      dennis: {
        food: 3,  // 5 + 2 - 4
        grain: 1,
        bonusPoints: 0,
        occupations: ['furniture-carpenter-b101'],
      },
    })
  })

  test('does not offer when player has less than 2 food', () => {
    const game = t.fixture({ numPlayers: 2 })
    // Give micah the Joinery, dennis has 1 food (less than 2)
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['furniture-carpenter-b101'],
        food: 1,
      },
      micah: {
        majorImprovements: ['joinery'],
      },
    })
    game.run()

    // Take non-food actions so dennis keeps only 1 food at harvest
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Grain Seeds')  // micah

    // At harvest: dennis has 1 food — FC doesn't offer (needs 2)
    // Feeding: needs 4, has 1 → 3 begging cards
    t.testBoard(game, {
      dennis: {
        clay: 1,
        reed: 1,
        bonusPoints: 0,
        beggingCards: 3,
        occupations: ['furniture-carpenter-b101'],
      },
    })
  })
})
