const t = require('../../../testutil_v2.js')

describe('Stockyard', () => {
  test('returns correct holding with capacity 3 and sameTypeOnly', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    const holdings = player.getAnimalHoldingCards()
    expect(holdings).toHaveLength(1)
    expect(holdings[0].name).toBe('Stockyard')
    expect(holdings[0].capacity).toBe(3)
    expect(holdings[0].sameTypeOnly).toBe(true)
    expect(holdings[0].allowedTypes).toBeNull()
    expect(holdings[0].perTypeLimits).toBeNull()
    expect(holdings[0].mixedTypes).toBe(false)
  })

  test('auto-places overflow animals to Stockyard', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
        pet: 'sheep',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Pasture holds 2, pet slot full. Sheep Market gives 1 sheep.
    // Overflow goes to Stockyard.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 4 },
        pet: 'sheep',
        minorImprovements: ['stockyard-b012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
    })

    const player = game.players.byName('dennis')
    expect(player.getCardAnimalTotal('stockyard-b012')).toBe(1)
    expect(player.getCardAnimals('stockyard-b012').sheep).toBe(1)
  })

  test('rejects different type when card already has one', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    // Stockyard empty: boar capacity includes Stockyard (pet 1 + stockyard 3 = 4)
    expect(player.getTotalAnimalCapacity('boar')).toBe(4)

    // Place sheep on the card
    player.addCardAnimal('stockyard-b012', 'sheep', 1)

    // Now boar capacity should NOT include Stockyard (already has sheep)
    expect(player.getTotalAnimalCapacity('boar')).toBe(1) // just pet

    // Sheep capacity still includes remaining Stockyard room
    expect(player.getTotalAnimalCapacity('sheep')).toBe(3) // pet(1) + stockyard(2 remaining)
  })

  test('capacity counted in getTotalAnimalCapacity', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    // Pet slot (1) + Stockyard (3) = 4 for sheep
    const sheepCapacity = player.getTotalAnimalCapacity('sheep')
    expect(sheepCapacity).toBe(4)
  })

  test('appears in animal placement locations with correct flags', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    const locations = player.getAnimalPlacementLocations()
    const cardLoc = locations.find(l => l.id === 'card-stockyard-b012')
    expect(cardLoc).toBeDefined()
    expect(cardLoc.name).toBe('Stockyard')
    expect(cardLoc.sameTypeOnly).toBe(true)
    expect(cardLoc.mixedTypes).toBe(false)
    expect(cardLoc.maxCapacity).toBe(3)
    expect(cardLoc.allowedTypes).toBeNull()
  })
})
