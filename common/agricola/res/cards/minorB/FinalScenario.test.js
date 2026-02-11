const t = require('../../../testutil_v2.js')

describe('Final Scenario', () => {
  test('provides owner-only action space with renovation and/or fencing', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['final-scenario-b023'],
        clay: 2, // renovation cost for 2 rooms
        reed: 1,
      },
    })
    game.run()

    // Dennis uses Final Scenario action space
    t.choose(game, 'Final Scenario')
    t.choose(game, 'Renovate')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        wood: 3, // from Forest
        minorImprovements: ['final-scenario-b023'],
      },
    })
  })

  test('action space not available to other player (ownerOnly)', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['final-scenario-b023'],
      },
    })
    game.run()

    // Micah should not see Final Scenario as an option
    expect(t.currentChoices(game)).not.toContain('Final Scenario')
  })

  test('action space not available in round 14', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['final-scenario-b023'],
      },
    })
    game.run()

    // Final Scenario should not be available since the real round 14 card is on the board
    expect(t.currentChoices(game)).not.toContain('Final Scenario')
  })
})
