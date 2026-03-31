const t = require('./testutil_v2.js')

describe('callPlayerCardHookOrdered', () => {
  // DistrictManager (occupationB) and InnerDistrictsDirector (occupationC)
  // both have onAction hooks that fire on take-wood (Forest)

  test('two onAction cards trigger ordering prompt', () => {
    const game = t.fixture({
      cardSets: ['occupationB', 'occupationC', 'test'],
      numPlayers: 4,
    })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 3 }],
      dennis: {
        occupations: ['district-manager-b158', 'inner-districts-director-c093'],
      },
    })
    game.run()
    t.choose(game, 'Forest')

    // Player should be prompted to choose ordering of 2 onAction hooks
    const choices = t.currentChoices(game)
    expect(choices).toContain('District Manager')
    expect(choices).toContain('Inner Districts Director')

    // Pick which to resolve first (second fires automatically)
    t.choose(game, 'Inner Districts Director')

    // Inner Districts Director offers to place stone on Clay Pit
    t.choose(game, 'Do not place stone')

    t.testBoard(game, {
      dennis: {
        occupations: ['district-manager-b158', 'inner-districts-director-c093'],
        wood: 3,
      },
    })
  })

  test('single onAction card skips ordering prompt', () => {
    const game = t.fixture({
      cardSets: ['occupationC', 'test'],
      numPlayers: 4,
    })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 3 }],
      dennis: {
        occupations: ['inner-districts-director-c093'],
      },
    })
    game.run()
    t.choose(game, 'Forest')

    // No ordering prompt — goes straight to Inner Districts Director's choice
    const choices = t.currentChoices(game)
    expect(choices).toContain('Do not place stone')

    t.choose(game, 'Do not place stone')

    t.testBoard(game, {
      dennis: {
        occupations: ['inner-districts-director-c093'],
        wood: 3,
      },
    })
  })
})
