const t = require('../../../testutil_v2.js')

describe('Mud Patch', () => {
  test('gives 1 boar on play via Meeting Place with pasture', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['mud-patch-a011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Mud Patch')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        hand: [],
        minorImprovements: ['mud-patch-a011'],
        animals: { boar: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], boar: 1 }],
        },
      },
    })
  })

  test('holds 1 boar per unplanted field tile', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mud-patch-a011'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },                              // empty
            { row: 2, col: 1 },                              // empty
            { row: 2, col: 2, crop: 'grain', cropCount: 3 }, // planted
          ],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const holding = dennis.getAnimalHoldingCards().find(h => h.cardId === 'mud-patch-a011')
    expect(holding.capacity).toBe(2)
    expect(holding.allowedTypes).toEqual(['boar'])
  })

  test('boar goes on card when fields are the only space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['mud-patch-a011'],
        pet: 'sheep', // blocks the house slot for boar
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Mud Patch')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCardAnimals('mud-patch-a011').boar).toBe(1)

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        hand: [],
        pet: 'sheep',
        minorImprovements: ['mud-patch-a011'],
        animals: { sheep: 1, boar: 1 },
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('boar is evicted from card when its field is sown', () => {
    const game = t.fixture({ cardSets: ['minorImprovementA', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mud-patch-a011'],
        grain: 1,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
      actionSpaces: ['Grain Utilization'],
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.players.byName('dennis').addCardAnimal('mud-patch-a011', 'boar', 1)
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
    // Sowing drops the card's capacity to 0 → boar evicted, auto-placed in
    // the empty house pet slot.

    t.testBoard(game, {
      dennis: {
        grain: 0,
        pet: 'boar',
        minorImprovements: ['mud-patch-a011'],
        animals: { boar: 1 },
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})
