const t = require('../../../testutil_v2.js')

describe('Hollow Warden', () => {
  test('onPlay offers to build Fireplace', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Lessons A'],
      dennis: {
        hand: ['hollow-warden-a139'],
        clay: 2, // Enough for fireplace-2
        food: 0,
      },
    })
    game.run()

    // Play Hollow Warden
    t.choose(game, 'Lessons A')
    t.choose(game, 'Hollow Warden')

    // Should be offered to build Fireplace
    const choices = t.currentChoices(game)
    expect(choices.some(c => c.includes('Fireplace'))).toBe(true)

    // Choose to build Fireplace (2 clay)
    const fireplaceChoice = choices.find(c => c.includes('fireplace-2'))
    expect(fireplaceChoice).toBeDefined()
    t.choose(game, fireplaceChoice)

    t.testBoard(game, {
      dennis: {
        occupations: ['hollow-warden-a139'],
        majorImprovements: ['fireplace-2'],
        clay: 0, // Paid 2 clay
      },
    })
  })

  test('onPlay offers Fireplace but player can skip', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Lessons A'],
      dennis: {
        hand: ['hollow-warden-a139'],
        clay: 0, // Cannot afford
      },
    })
    game.run()

    // Play Hollow Warden
    t.choose(game, 'Lessons A')
    t.choose(game, 'Hollow Warden')

    // Should not be offered Fireplace if cannot afford, or can skip
    const choices = t.currentChoices(game)
    if (choices.some(c => c.includes('Do not build') || c.includes('Skip'))) {
      t.choose(game, choices.find(c => c.includes('Do not build') || c.includes('Skip')))
    }

    t.testBoard(game, {
      dennis: {
        occupations: ['hollow-warden-a139'],
        majorImprovements: [],
      },
    })
  })

  test('onAction gives 1 food when using Hollow space', () => {
    // Note: Hollow is automatically available in 3+ player games (not available in 2-player)
    // Cannot be set via actionSpaces - it's added automatically at game start
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1, // Use round - Hollow is automatically available in 3+ player games
      dennis: {
        occupations: ['hollow-warden-a139'],
        food: 0,
        clay: 0,
      },
    })
    game.run()

    // Hollow action space is automatically available in 3-player games
    const choices = t.currentChoices(game)
    expect(choices).toContain('Hollow')

    // Use Hollow - it accumulates 1 clay per round, so after round 1 replenish it should have 1
    t.choose(game, 'Hollow')

    t.testBoard(game, {
      dennis: {
        occupations: ['hollow-warden-a139'],
        food: 1, // +1 from Hollow Warden
        clay: 1, // +1 from Hollow space (accumulates 1 per round in 3-player games)
      },
    })
  })
})
