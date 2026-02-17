const t = require('../testutil_v2.js')

describe('Fencing', () => {
  test('fencing around an unfenced stable preserves the animal on it', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Sheep Market', 'Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        wood: 10,
        food: 20,
        pet: 'sheep',
        farmyard: {
          stables: [{ row: 2, col: 4 }],
        },
        animals: { sheep: 1 },
      },
      micah: { food: 20 },
    })
    game.run()

    // dennis: build fences around the stable at (2,4)
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 4 }] })
    t.choose(game, 'Done building fences')

    // Fill remaining actions: micah DL, dennis Grain Seeds, micah Clay Pit
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 6, // 10 - 4 fences for single corner space
        food: 20,
        grain: 1,
        pet: 'sheep',
        farmyard: {
          stables: [{ row: 2, col: 4 }],
          pastures: [{ spaces: [{ row: 2, col: 4 }], sheep: 1 }],
        },
        animals: { sheep: 2 }, // 1 pet + 1 in pasture (migrated from unfenced stable)
      },
    })
  })
})
