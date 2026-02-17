const t = require('../../../testutil_v2.js')

describe("Witches' Dance Floor", () => {
  test('satisfies occupation prereq', () => {
    // Wheel Plow requires { occupations: 2 }
    // Dennis has 1 occupation + Witches' Dance Floor → wildcard as occupation → 2 occupations
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wheel-plow-a018'],
        wood: 2, // Wheel Plow costs 2 wood
        occupations: ['test-occupation-1'],
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    // Dennis takes Meeting Place and plays Wheel Plow (prereqs met via wildcard)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Wheel Plow')

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['witches-dance-floor-d025', 'wheel-plow-a018'],
        wood: 0, // 2 - 2 cost
        food: 1, // Meeting Place gives 1 food
      },
    })
  })

  test('satisfies field prereq', () => {
    // Silage requires { fields: 2 }
    // Dennis has 1 field + Witches' Dance Floor → wildcard as field → 2 fields
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['silage-a084'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    // Dennis takes Meeting Place and plays Silage (prereqs met via wildcard)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Silage')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['witches-dance-floor-d025', 'silage-a084'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
        food: 1, // Meeting Place gives 1 food
      },
    })
  })

  test('satisfies major improvement prereq', () => {
    // Bunk Beds requires { majorImprovements: 2 }
    // Dennis has 1 major + Witches' Dance Floor → wildcard as fireplace → 2 majors
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bunk-beds-c010'],
        wood: 1, // Bunk Beds costs 1 wood
        majorImprovements: ['fireplace-2'],
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    // Dennis takes Meeting Place and plays Bunk Beds (prereqs met via wildcard)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bunk Beds')

    t.testBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        minorImprovements: ['witches-dance-floor-d025', 'bunk-beds-c010'],
        wood: 0, // 1 - 1 cost
        food: 1, // Meeting Place gives 1 food
      },
    })
  })

  test('only one role at a time', () => {
    // Cesspit requires { fields: 2, occupations: 1 }
    // Dennis has 1 field, 0 occupations + Witches' Dance Floor
    // Wildcard can fill one gap but not both → should fail
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['cesspit-d040'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
        minorImprovements: ['witches-dance-floor-d025'],
      },
    })
    game.run()

    // Dennis takes Meeting Place — Cesspit prereqs not met, improvement step auto-skipped
    t.choose(game, 'Meeting Place')
    // After Meeting Place, game should move to Micah's turn (no improvement offered)
    // "Minor Improvement" would appear if any minor was playable
    expect(t.currentChoices(game)).not.toContain('Minor Improvement')
  })

  test('no cooking ability', () => {
    // Witches' Dance Floor acts as fireplace for prereqs but does NOT provide cooking ability
    // Set up harvest: Dennis has sheep but no real fireplace — cooking shouldn't be offered
    const game = t.fixture()
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['witches-dance-floor-d025'],
        food: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play through round 4 actions
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Feeding phase: Dennis has 2 food (Day Laborer) but needs 4 (2 workers)
    // Without cooking ability, no "Cook" options should appear
    const choices = t.currentChoices(game)
    const cookChoices = choices.filter(c => typeof c === 'string' && c.includes('Cook'))
    expect(cookChoices).toHaveLength(0)
  })

  test('counts as field for scoring', () => {
    // Witches' Dance Floor's wildcard counts as a field for scoring
    // With 1 real field + 1 WDF wildcard = 2 fields → +1 pts instead of -1 = +2 change
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['witches-dance-floor-d025'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
      },
    })
    game.run()

    // Play through round 1
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Score: fields=2 (+1), pastures=0 (-1), grain=1 (+1), veg=0 (-1),
    // sheep=0 (-1), boar=0 (-1), cattle=0 (-1), rooms=2 wood (0),
    // family=2 (6), unused=12 (-12), stables=0 (0), begging=0 (0), cardPoints=0
    // Total = 1 + (-1) + 1 + (-1) + (-1) + (-1) + (-1) + 0 + 6 + (-12) + 0 = -9
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['witches-dance-floor-d025'],
        farmyard: { fields: [{ row: 0, col: 2 }] },
        food: 2, // Day Laborer
        grain: 1, // Grain Seeds
        score: -9,
      },
    })
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

    t.testBoard(game, {
      dennis: {
        clay: 5, // Upgrade is free
        majorImprovements: ['cooking-hearth-4'],
        minorImprovements: [], // Witches' Dance Floor removed
      },
    })
  })
})
