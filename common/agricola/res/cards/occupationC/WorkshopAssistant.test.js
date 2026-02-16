const t = require('../../../testutil_v2.js')

describe('Workshop Assistant', () => {
  // Card text: "Place a unique pair of different building resources on this card
  // for each of your improvements (including this one). Each time another player
  // renovates, you may move one such pair to your supply."

  test('takes a resource pair when another player renovates', () => {
    // 3 players. dennis has Workshop Assistant + 1 minor improvement (2 pairs total).
    // micah renovates → dennis is offered a pair.
    // Default turn order: dennis, micah, scott.
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      dennis: {
        occupations: ['workshop-assistant-c146'],
        minorImprovements: ['test-minor-1'],
        food: 10,
      },
      micah: {
        food: 10,
        clay: 5,
        reed: 5,
      },
    })
    game.run()

    // dennis takes Forest
    t.choose(game, 'Forest')

    // micah renovates via House Redevelopment (wood → clay)
    t.choose(game, 'House Redevelopment')

    // Workshop Assistant fires (lazy init creates 2 pairs: 1 improvement + 1 for itself)
    // dennis chooses a pair
    t.choose(game, 'wood + clay')

    // After renovation, micah is offered an improvement — decline
    t.choose(game, 'Do not play an improvement')

    // dennis should have gained wood from Forest + 1 wood from pair, 1 clay from pair
    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs.length).toBe(1)
    t.testBoard(game, {
      dennis: {
        wood: 4,
        clay: 1,
        food: 10,
        occupations: ['workshop-assistant-c146'],
        minorImprovements: ['test-minor-1'],
      },
    })
  })

  test('can pass when another player renovates', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      dennis: {
        occupations: ['workshop-assistant-c146'],
        food: 10,
      },
      micah: {
        food: 10,
        clay: 5,
        reed: 5,
      },
    })
    game.run()

    // dennis takes Forest
    t.choose(game, 'Forest')

    // micah renovates
    t.choose(game, 'House Redevelopment')

    // Workshop Assistant fires: dennis passes
    t.choose(game, 'Pass')

    // After renovation, micah is offered an improvement — decline
    t.choose(game, 'Do not play an improvement')

    // Pairs remain unchanged (1 pair since no improvements)
    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs.length).toBe(1)

    t.testBoard(game, {
      dennis: {
        wood: 3,
        clay: 0,
        food: 10,
        occupations: ['workshop-assistant-c146'],
      },
    })
  })

  test('does not fire when owner renovates', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      dennis: {
        occupations: ['workshop-assistant-c146'],
        clay: 5,
        reed: 5,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // dennis renovates himself — should NOT trigger Workshop Assistant
    t.choose(game, 'House Redevelopment')

    // After renovation, dennis is offered an improvement — decline
    t.choose(game, 'Do not play an improvement')

    // Workshop Assistant should NOT have fired (owner renovating).
    // micah takes some action
    t.choose(game, 'Forest')

    // scott takes some action
    t.choose(game, 'Day Laborer')

    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs.length).toBe(1)
  })
})
