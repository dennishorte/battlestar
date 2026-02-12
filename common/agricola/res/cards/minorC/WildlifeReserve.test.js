const t = require('../../../testutil_v2.js')

describe('WildlifeReserve', () => {
  test('returns correct holding with perTypeLimits', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    const holdings = player.getAnimalHoldingCards()
    expect(holdings).toHaveLength(1)
    expect(holdings[0].name).toBe('Wildlife Reserve')
    expect(holdings[0].capacity).toBe(3)
    expect(holdings[0].mixedTypes).toBe(true)
    expect(holdings[0].perTypeLimits).toEqual({ sheep: 1, boar: 1, cattle: 1 })
    expect(holdings[0].allowedTypes).toEqual(['sheep', 'boar', 'cattle'])
    expect(holdings[0].sameTypeOnly).toBe(false)
  })

  test('auto-placement respects per-type limits', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        pet: 'sheep',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')

    // Pet is sheep (full). Add 1 sheep — goes to card (limit: 1 sheep)
    player.addAnimals('sheep', 1)
    expect(player.getCardAnimals('wildlife-reserve-c011').sheep).toBe(1)

    // Adding another sheep fails — card sheep limit reached, no other room
    const result = player.addAnimals('sheep', 1)
    expect(result).toBe(false)
    expect(player.getCardAnimals('wildlife-reserve-c011').sheep).toBe(1)

    // Boar can still be added to the card (separate per-type limit)
    player.addAnimals('boar', 1)
    expect(player.getCardAnimals('wildlife-reserve-c011').boar).toBe(1)
  })

  test('can hold mixed types simultaneously', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    player.addCardAnimal('wildlife-reserve-c011', 'sheep', 1)
    player.addCardAnimal('wildlife-reserve-c011', 'boar', 1)
    player.addCardAnimal('wildlife-reserve-c011', 'cattle', 1)

    expect(player.getCardAnimalTotal('wildlife-reserve-c011')).toBe(3)
    expect(player.getCardAnimals('wildlife-reserve-c011')).toEqual({ sheep: 1, boar: 1, cattle: 1 })
  })

  test('capacity per type in getTotalAnimalCapacity', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wildlife-reserve-c011'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    // Pet slot (1) + Wildlife Reserve sheep limit (1) = 2
    expect(player.getTotalAnimalCapacity('sheep')).toBe(2)
    expect(player.getTotalAnimalCapacity('boar')).toBe(2)
    expect(player.getTotalAnimalCapacity('cattle')).toBe(2)

    // Fill the sheep slot on the card
    player.addCardAnimal('wildlife-reserve-c011', 'sheep', 1)
    // Now sheep capacity from card is 0
    expect(player.getTotalAnimalCapacity('sheep')).toBe(1) // just pet
    // But boar still has room
    expect(player.getTotalAnimalCapacity('boar')).toBe(2) // pet + card
  })
})
