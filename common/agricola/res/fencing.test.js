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

  test('adding a new pasture adjacent to an existing one preserves animals', () => {
    // Start with a 2-space pasture at (2,3)+(2,4) holding 3 sheep
    // Build a new pasture at (2,2) — recalculatePastures runs and must
    // preserve the 3 sheep in the unchanged original pasture
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        wood: 10,
        food: 20,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 3 },
          ],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    // dennis: build a new 1-space pasture at (2,2) adjacent to the existing pasture
    // This triggers recalculatePastures which rebuilds all pastures
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 2 }] })
    t.choose(game, 'Done building fences')

    // Fill remaining actions
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 7, // 10 - 3 fences (new pasture at corner shares fence with existing)
        food: 20,
        grain: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 2 }] },
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 3 },
          ],
        },
        animals: { sheep: 3 }, // all 3 sheep preserved in original pasture
      },
    })
  })

  test('splitting a pasture caps animals at new capacity', () => {
    // Start with a 2-space pasture at (2,3)+(2,4) with a stable, holding 6 sheep
    // (capacity = 2 spaces * 2 * 2 stable bonus = 8)
    // Split it by fencing (2,3) separately from (2,4)+stable
    // (2,3) alone has capacity 2, (2,4)+stable has capacity 4
    // The 6 sheep must be distributed: one half gets up to its capacity
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        wood: 10,
        food: 20,
        farmyard: {
          stables: [{ row: 2, col: 4 }],
          pastures: [
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 6 },
          ],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    // Split: fence (2,3) as its own pasture
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }] })
    t.choose(game, 'Done building fences')

    // Fill remaining actions
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // (2,3) gets capped at 2 (no stable), (2,4) gets capped at 4 (has stable)
    // Total preserved: 2 + 4 = 6
    t.testBoard(game, {
      dennis: {
        wood: 9, // 10 - 1 fence (splitting fence between the two spaces)
        food: 20,
        grain: 1,
        farmyard: {
          stables: [{ row: 2, col: 4 }],
          pastures: [
            { spaces: [{ row: 2, col: 3 }], sheep: 2 },
            { spaces: [{ row: 2, col: 4 }], sheep: 4 },
          ],
        },
        animals: { sheep: 6 }, // all 6 preserved across both halves
      },
    })
  })
})
