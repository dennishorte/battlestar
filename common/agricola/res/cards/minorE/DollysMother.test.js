const t = require('../../../testutil_v2.js')

describe("Dolly's Mother", () => {
  test('returns holding with allowedTypes sheep and capacity 1', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 1 }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    const holdings = player.getAnimalHoldingCards()
    expect(holdings).toHaveLength(1)
    expect(holdings[0].name).toBe("Dolly's Mother")
    expect(holdings[0].capacity).toBe(1)
    expect(holdings[0].perTypeLimits).toEqual({ sheep: 1 })
    expect(holdings[0].allowedTypes).toEqual(['sheep'])
    expect(holdings[0].sameTypeOnly).toBe(false)
  })

  test('auto-placement: sheep goes to card, boar does not', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
        pet: 'sheep',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Pasture full, pet full. Sheep Market gives 1 sheep.
    // Dolly's Mother can hold 1 sheep.
    t.choose(game, 'Sheep Market')

    const player = game.players.byName('dennis')
    expect(player.getCardAnimals('dollys-mother-e084').sheep).toBe(1)
    expect(player.getCardAnimalTotal('dollys-mother-e084')).toBe(1)
  })

  test('getTotalAnimalCapacity for boar does not include Dolly\'s Mother', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 1 }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    // Sheep: pet(1) + pasture(2) + card(1) = 4
    expect(player.getTotalAnimalCapacity('sheep')).toBe(4)
    // Boar: pet(1) + pasture is taken by sheep (0) = 1 (no Dolly's Mother)
    expect(player.getTotalAnimalCapacity('boar')).toBe(1)
  })

  test('boar does not auto-place to Dolly\'s Mother', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 1, boar: 0 }],
        },
        pet: 'boar',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    const player = game.players.byName('dennis')
    // Pasture has sheep (prereq met). Pet is boar.
    // No room for boar — card only accepts sheep, pasture has sheep.
    expect(player.addAnimals('boar', 1)).toBe(false)
    expect(player.getCardAnimals('dollys-mother-e084').boar).toBe(0)
  })
})
