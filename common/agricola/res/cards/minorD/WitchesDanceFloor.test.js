const t = require('../../../testutil_v2.js')

describe("Witches' Dance Floor", () => {
  test('satisfies occupation prereq', () => {
    // Wheel Plow requires { occupations: 2 }
    // Dennis has 1 occupation + Witches' Dance Floor → wildcard as occupation → 2 occupations
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        hand: ['wheel-plow-a018'],
        occupations: ['test-occupation-1'],
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.meetsCardPrereqs('wheel-plow-a018')).toBe(true)
  })

  test('satisfies field prereq', () => {
    // Silage requires { fields: 2 }
    // Dennis has 1 field + Witches' Dance Floor → wildcard as field → 2 fields
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        hand: ['silage-a084'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.meetsCardPrereqs('silage-a084')).toBe(true)
  })

  test('satisfies major improvement prereq', () => {
    // Bunk Beds requires { majorImprovements: 2 }
    // Dennis has 1 major + Witches' Dance Floor → wildcard as fireplace → 2 majors
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        hand: ['bunk-beds-c010'],
        majorImprovements: ['fireplace-2'],
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.meetsCardPrereqs('bunk-beds-c010')).toBe(true)
  })

  test('only one role at a time', () => {
    // Cesspit requires { fields: 2, occupations: 1 }
    // Dennis has 1 field, 0 occupations + Witches' Dance Floor
    // Wildcard can fill one gap but not both → should fail
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        hand: ['cesspit-d040'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.meetsCardPrereqs('cesspit-d040')).toBe(false)
  })

  test('no cooking ability', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.hasCookingAbility()).toBe(false)
  })

  test('counts as field for scoring', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const scoreState = dennis.getScoreState()
    // 0 grid fields + 1 from wildcard = 1
    expect(scoreState.fields).toBe(1)
  })

  test('can be traded in for Cooking Hearth', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        clay: 5,
        minorImprovements: ['witches-dance-floor-d025'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    // Dennis takes Major Improvement action
    t.choose(game, 'Major Improvement')
    // Select Cooking Hearth (upgrades from fireplace — wildcard counts as fireplace)
    t.choose(game, 'Major Improvement.Cooking Hearth (cooking-hearth-4)')

    const dennis = game.players.byName('dennis')
    expect(dennis.majorImprovements).toContain('cooking-hearth-4')
    // Witches' Dance Floor should be removed from play
    expect(dennis.playedMinorImprovements).not.toContain('witches-dance-floor-d025')
    // Upgrade is free — clay unchanged
    expect(dennis.clay).toBe(5)
  })
})
