const t = require('../../../testutil_v2.js')

describe('Reclamation Plow', () => {
  test('plows a field after taking sheep when played via Major Improvement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reclamation-plow-a017'],
        wood: 1, // cost to play Reclamation Plow
      },
      actionSpaces: ['Sheep Market', 'Major Improvement'],
    })
    game.run()

    // dennis: play Reclamation Plow via Major Improvement action
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Reclamation Plow')
    // onPlay fires → reclamationPlowActive = true

    // micah: simple action
    t.choose(game, 'Day Laborer')

    // dennis: take sheep from Sheep Market (1 accumulated)
    // canPlaceAnimals returns true (1 sheep as house pet)
    // onTakeAnimals fires → ReclamationPlow calls plowField
    t.choose(game, 'Sheep Market')
    t.action(game, 'plow-space', { row: 0, col: 2 })

    // micah: simple action
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        pet: 'sheep',
        minorImprovements: ['reclamation-plow-a017'],
        animals: { sheep: 1 },
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })

    // Verify reclamationPlowActive is now false (one-time use)
    const dennis = t.dennis(game)
    expect(dennis.reclamationPlowActive).toBe(false)
  })

  test('plows after rearranging to accommodate taken cattle', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['reclamation-plow-a017'],
        // Pet occupied + pasture has boar → cattle cannot auto-place
        pet: 'sheep',
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], boar: 1 }],
        },
      },
      actionSpaces: [{ ref: 'Cattle Market', accumulated: 1 }],
    })
    game.testSetBreakpoint('replenish-complete', (game) => {
      game.players.byName('dennis').reclamationPlowActive = true
    })
    game.run()

    // Take cattle; boot the boar and place cattle in the pasture
    t.choose(game, 'Cattle Market')
    t.action(game, 'animal-placement', {
      placements: [{ locationId: 'pasture-0', animalType: 'cattle', count: 1 }],
      removals: [{ locationId: 'pasture-0', animalType: 'boar', count: 1 }],
      overflow: { release: { boar: 1 } },
    })
    t.action(game, 'plow-space', { row: 0, col: 2 })

    t.testBoard(game, {
      dennis: {
        pet: 'sheep',
        animals: { sheep: 1, cattle: 1, boar: 0 },
        minorImprovements: ['reclamation-plow-a017'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], cattle: 1 }],
          fields: [{ row: 0, col: 2 }],
        },
      },
    })

    const dennis = t.dennis(game)
    expect(dennis.reclamationPlowActive).toBe(false)
  })

  test('plows when farm is full but taken animals could fit by freeing space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['reclamation-plow-a017'],
        // Pasture full of sheep, pet blocked → cannot auto-place another sheep,
        // but rearrangeable capacity (pasture + pet) can hold the taken sheep.
        pet: 'boar',
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.testSetBreakpoint('replenish-complete', (game) => {
      game.players.byName('dennis').reclamationPlowActive = true
    })
    game.run()

    // Net-zero farm layout: release the taken sheep (or an existing one — same payload).
    // Bonus still fires because accommodating 1 sheep was possible.
    t.choose(game, 'Sheep Market')
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { release: { sheep: 1 } },
    })
    t.action(game, 'plow-space', { row: 0, col: 2 })

    t.testBoard(game, {
      dennis: {
        pet: 'boar',
        animals: { sheep: 2, boar: 1 },
        minorImprovements: ['reclamation-plow-a017'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
          fields: [{ row: 0, col: 2 }],
        },
      },
    })

    expect(t.dennis(game).reclamationPlowActive).toBe(false)
  })

  test('does not plow when taken animals cannot fit even after rearranging', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['reclamation-plow-a017'],
        // Only pet capacity (1) — cannot house 2 sheep even if emptied
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 2 }],
    })
    game.testSetBreakpoint('replenish-complete', (game) => {
      game.players.byName('dennis').reclamationPlowActive = true
      game.state.actionSpaces['take-sheep'].accumulated = 2
    })
    game.run()

    t.choose(game, 'Sheep Market')
    t.action(game, 'animal-placement', {
      placements: [{ locationId: 'house', animalType: 'sheep', count: 1 }],
      overflow: { release: { sheep: 1 } },
    })

    const dennis = t.dennis(game)
    expect(dennis.reclamationPlowActive).toBe(true)
    expect(dennis.getTotalAnimals('sheep')).toBe(1)
  })
})
