const t = require('../../../testutil_v2.js')

describe('Workshop Assistant', () => {
  // Card text: "Place a unique pair of different building resources on this card
  // for each of your improvements. Each time another player renovates, you may
  // move one such pair to your supply."

  // setBoard does not call onPlay, so tests that start with the card already in
  // play seed the pairs directly. Copy on each replay so the card's mutations
  // don't leak into the next run().
  function seedPairs(game, pairs) {
    game.testSetBreakpoint('initialization-complete', (g) => {
      const s = g.cardState('workshop-assistant-c146')
      s.pairs = pairs.map(p => [...p])
      s.pile = pairs.flat()
    })
  }

  test('places one pair per improvement when played', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        hand: ['workshop-assistant-c146'],
        minorImprovements: ['test-minor-1', 'test-minor-2'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Workshop Assistant')

    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs).toEqual([
      ['wood', 'clay'],
      ['wood', 'reed'],
    ])
    expect(s.pile).toEqual(['wood', 'clay', 'wood', 'reed'])
  })

  test('places no pairs when played with no improvements', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        hand: ['workshop-assistant-c146'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Workshop Assistant')

    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs).toEqual([])
    expect(s.pile).toEqual([])
  })

  test('caps at 6 unique pairs even with more than 6 improvements', () => {
    // 4 building resources → C(4,2) = 6 unique pairs
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        hand: ['workshop-assistant-c146'],
        minorImprovements: [
          'test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4',
          'test-minor-5', 'test-minor-6', 'test-minor-7', 'test-minor-8',
        ],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Workshop Assistant')

    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs).toEqual([
      ['wood', 'clay'],
      ['wood', 'reed'],
      ['wood', 'stone'],
      ['clay', 'reed'],
      ['clay', 'stone'],
      ['reed', 'stone'],
    ])
  })

  test('building an improvement after play does not add a pair', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['workshop-assistant-c146'],
        minorImprovements: ['test-minor-1'],
        hand: ['test-minor-2'],
        food: 10,
      },
      micah: { food: 10 },
    })
    seedPairs(game, [['wood', 'clay']])
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 2')

    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs).toEqual([['wood', 'clay']])
  })

  test('takes a resource pair when another player renovates', () => {
    // 3 players. dennis has Workshop Assistant with 1 pair on it.
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
    seedPairs(game, [['wood', 'clay']])
    game.run()

    // dennis takes Forest
    t.choose(game, 'Forest')

    // micah renovates via House Redevelopment (wood → clay)
    t.choose(game, 'House Redevelopment')

    // Workshop Assistant fires: dennis chooses a pair
    t.choose(game, 'wood + clay')

    // After renovation, micah is offered an improvement — decline
    t.choose(game, 'Do not play an improvement')

    // dennis should have gained wood from Forest + 1 wood from pair, 1 clay from pair
    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs.length).toBe(0)
    expect(s.pile).toEqual([])
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
        minorImprovements: ['test-minor-1'],
        food: 10,
      },
      micah: {
        food: 10,
        clay: 5,
        reed: 5,
      },
    })
    seedPairs(game, [['wood', 'clay']])
    game.run()

    // dennis takes Forest
    t.choose(game, 'Forest')

    // micah renovates
    t.choose(game, 'House Redevelopment')

    // Workshop Assistant fires: dennis passes
    t.choose(game, 'Pass')

    // After renovation, micah is offered an improvement — decline
    t.choose(game, 'Do not play an improvement')

    // Pair remains on the card
    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs.length).toBe(1)

    t.testBoard(game, {
      dennis: {
        wood: 3,
        clay: 0,
        food: 10,
        occupations: ['workshop-assistant-c146'],
        minorImprovements: ['test-minor-1'],
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
        minorImprovements: ['test-minor-1'],
        clay: 5,
        reed: 5,
        food: 10,
      },
      micah: { food: 10 },
    })
    seedPairs(game, [['wood', 'clay']])
    game.run()

    // dennis renovates himself — should NOT trigger Workshop Assistant
    t.choose(game, 'House Redevelopment')

    // After renovation, dennis is offered an improvement — decline
    t.choose(game, 'Do not play an improvement')

    // micah takes some action
    t.choose(game, 'Forest')

    // scott takes some action
    t.choose(game, 'Day Laborer')

    const s = game.cardState('workshop-assistant-c146')
    expect(s.pairs.length).toBe(1)
  })

  test('does not fire when the card is empty', () => {
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
    seedPairs(game, [])
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'House Redevelopment')

    // No Workshop Assistant prompt; micah goes straight to the improvement offer
    t.choose(game, 'Do not play an improvement')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        food: 10,
        occupations: ['workshop-assistant-c146'],
      },
    })
  })
})
