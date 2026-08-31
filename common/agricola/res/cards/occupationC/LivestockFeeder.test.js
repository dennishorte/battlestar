const t = require('../../../testutil_v2.js')

describe('Livestock Feeder', () => {
  // Card text: "When you play this card, you get 1 grain. Each grain in your
  // supply can hold 1 animal of any type."

  test('gives grain on play', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['livestock-feeder-c086'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Livestock Feeder')

    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 1,
        occupations: ['livestock-feeder-c086'],
      },
    })
  })

  test('spending grain over capacity forces extra animals off the card', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['livestock-feeder-c086'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        pet: 'boar',
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.players.byName('dennis').addCardAnimal('livestock-feeder-c086', 'sheep', 2)
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { release: { sheep: 1 } },
    })

    t.testBoard(game, {
      dennis: {
        occupations: ['livestock-feeder-c086'],
        majorImprovements: ['fireplace-2'],
        grain: 1,
        food: 2,
        pet: 'boar',
        animals: { sheep: 1, boar: 1 },
      },
    })
    expect(game.players.byName('dennis').getCardAnimals('livestock-feeder-c086').sheep).toBe(1)
  })

  test('spending grain does not prompt when animals still fit', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['livestock-feeder-c086'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        pet: 'boar',
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.players.byName('dennis').addCardAnimal('livestock-feeder-c086', 'sheep', 1)
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        occupations: ['livestock-feeder-c086'],
        majorImprovements: ['fireplace-2'],
        grain: 1,
        food: 2,
        pet: 'boar',
        animals: { sheep: 1, boar: 1 },
      },
    })
    expect(game.players.byName('dennis').getCardAnimals('livestock-feeder-c086').sheep).toBe(1)
  })

  test('overflow animals move to open pasture space', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['livestock-feeder-c086'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        pet: 'boar',
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 4 }] }],
        },
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.players.byName('dennis').addCardAnimal('livestock-feeder-c086', 'sheep', 2)
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        occupations: ['livestock-feeder-c086'],
        majorImprovements: ['fireplace-2'],
        grain: 1,
        food: 2,
        pet: 'boar',
        animals: { sheep: 2, boar: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 4 }], sheep: 1 }],
        },
      },
    })
    expect(game.players.byName('dennis').getCardAnimals('livestock-feeder-c086').sheep).toBe(1)
  })
})
