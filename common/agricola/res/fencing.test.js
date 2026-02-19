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

  // ---------------------------------------------------------------------------
  // Basic single-space pastures
  // ---------------------------------------------------------------------------

  describe('basic single-space pastures', () => {
    test('corner space (2,4) costs 4 wood', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 4 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 6, // 10 - 4 (2 edge + 2 internal)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{ spaces: [{ row: 2, col: 4 }] }],
          },
        },
      })
    })

    test('edge-middle space (2,2) costs 4 wood', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 2 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 6, // 10 - 4 (1 edge + 3 internal)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{ spaces: [{ row: 2, col: 2 }] }],
          },
        },
      })
    })

    test('interior space (1,2) costs 4 wood', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 1, col: 2 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 6, // 10 - 4 (0 edge + 4 internal)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{ spaces: [{ row: 1, col: 2 }] }],
          },
        },
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Multi-space pasture shapes
  // ---------------------------------------------------------------------------

  describe('multi-space pasture shapes', () => {
    test('2-space horizontal pasture (2,3+2,4) costs 6 wood', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', {
        spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }],
      })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 4, // 10 - 6 (3 edge + 3 internal)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
          },
        },
      })
    })

    test('2-space vertical pasture (1,4+2,4) costs 6 wood', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', {
        spaces: [{ row: 1, col: 4 }, { row: 2, col: 4 }],
      })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 4, // 10 - 6 (3 edge + 3 internal)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{ spaces: [{ row: 1, col: 4 }, { row: 2, col: 4 }] }],
          },
        },
      })
    })

    test('L-shape 3-space pasture (2,2+2,3+1,3) costs 8 wood', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', {
        spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }, { row: 1, col: 3 }],
      })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 2, // 10 - 8 (2 edge + 6 internal)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{
              spaces: [{ row: 1, col: 3 }, { row: 2, col: 2 }, { row: 2, col: 3 }],
            }],
          },
        },
      })
    })

    test('2x2 rectangle pasture (1,3+1,4+2,3+2,4) costs 8 wood', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', {
        spaces: [
          { row: 1, col: 3 }, { row: 1, col: 4 },
          { row: 2, col: 3 }, { row: 2, col: 4 },
        ],
      })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 2, // 10 - 8 (4 edge + 4 internal)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{
              spaces: [
                { row: 1, col: 3 }, { row: 1, col: 4 },
                { row: 2, col: 3 }, { row: 2, col: 4 },
              ],
            }],
          },
        },
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Multiple pastures in one fencing action
  // ---------------------------------------------------------------------------

  describe('multiple pastures in one fencing action', () => {
    test('building two adjacent pastures costs 7 wood total (shared fence)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      // Build first pasture at (2,4): 4 fences
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 4 }] })
      t.choose(game, 'Build another pasture')
      // Build second pasture at (2,3): 3 fences (shares right wall with existing)
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 3, // 10 - 4 - 3 = 3
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 3 }] },
              { spaces: [{ row: 2, col: 4 }] },
            ],
          },
        },
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Shared fences between adjacent pastures
  // ---------------------------------------------------------------------------

  describe('shared fences between adjacent pastures', () => {
    test('new pasture adjacent to existing needs only 3 fences', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            pastures: [{ spaces: [{ row: 2, col: 4 }] }],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      // Build new pasture at (2,3) — right wall is shared with existing (2,4)
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 7, // 10 - 3 (shared right fence already exists)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 3 }] },
              { spaces: [{ row: 2, col: 4 }] },
            ],
          },
        },
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Pastures with stables
  // ---------------------------------------------------------------------------

  describe('pastures with stables', () => {
    test('1-space pasture with stable is created correctly', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            stables: [{ row: 2, col: 4 }],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 4 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      // 1-space pasture with stable: capacity = 2 * 2 = 4
      t.testBoard(game, {
        dennis: {
          wood: 6, // 10 - 4
          food: 20,
          grain: 1,
          farmyard: {
            stables: [{ row: 2, col: 4 }],
            pastures: [{ spaces: [{ row: 2, col: 4 }] }],
          },
        },
      })
    })

    test('2-space pasture with 1 stable is created correctly', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            stables: [{ row: 2, col: 4 }],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', {
        spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }],
      })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      // 2-space pasture with 1 stable: capacity = 4 * 2 = 8
      t.testBoard(game, {
        dennis: {
          wood: 4, // 10 - 6
          food: 20,
          grain: 1,
          farmyard: {
            stables: [{ row: 2, col: 4 }],
            pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
          },
        },
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Validation failures
  // ---------------------------------------------------------------------------

  describe('validation', () => {
    test('cannot fence room spaces', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      // Attempt pasture that includes room space (0,0)
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 0 }] })
      // Validation fails — fencing action ends

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 10, // unchanged
          food: 20,
          grain: 1,
        },
      })
    })

    test('cannot fence field spaces', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            fields: [{ row: 1, col: 2 }],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      // Attempt pasture that includes field space (1,2)
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 1, col: 2 }] })
      // Validation fails — fencing action ends

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 10,
          food: 20,
          grain: 1,
          farmyard: {
            fields: [{ row: 1, col: 2 }],
          },
        },
      })
    })

    test('disconnected spaces are rejected', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      // (2,0) and (2,2) are not adjacent — gap at (2,1)
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', {
        spaces: [{ row: 2, col: 0 }, { row: 2, col: 2 }],
      })
      // Validation fails — fencing action ends

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 10,
          food: 20,
          grain: 1,
        },
      })
    })

    test('diagonal-only spaces are rejected', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 10, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      // (1,1) and (2,2) are diagonal — not orthogonally connected
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', {
        spaces: [{ row: 1, col: 1 }, { row: 2, col: 2 }],
      })

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 10,
          food: 20,
          grain: 1,
        },
      })
    })

    test('second pasture must connect to existing fences', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 15, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      // Build first pasture at (2,4) — succeeds (first pasture, no connectivity needed)
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 4 }] })
      t.choose(game, 'Build another pasture')

      // Attempt second pasture at (2,0) — far from (2,4), no shared fence corners
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })
      // Second pasture fails connectivity check; first pasture still exists

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 11, // 15 - 4 (only first pasture built)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{ spaces: [{ row: 2, col: 4 }] }],
          },
        },
      })
    })

    test('insufficient wood rejects pasture', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 2, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      // 2 wood is not enough for a 4-fence pasture
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 4 }] })
      // Validation fails — fencing action ends

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 2, // unchanged
          food: 20,
          grain: 1,
        },
      })
    })

    test('fence limit (15 max) prevents building', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 4 }] },
              { spaces: [{ row: 2, col: 3 }] },
              { spaces: [{ row: 2, col: 2 }] },
              { spaces: [{ row: 2, col: 1 }] },
            ],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      // 13 existing fences. (2,0) needs 3 more = 16 > 15 limit
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })
      // Validation fails — fence limit exceeded

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 10, // unchanged
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 1 }] },
              { spaces: [{ row: 2, col: 2 }] },
              { spaces: [{ row: 2, col: 3 }] },
              { spaces: [{ row: 2, col: 4 }] },
            ],
          },
        },
      })
    })

    test('no wood skips fencing action', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 0, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      // With 0 wood, buildFences logs "has no wood" and ends immediately
      t.choose(game, 'Fencing')
      // No space selection presented — action ends

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          food: 20,
          grain: 1,
        },
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Animal preservation (additional tests)
  // ---------------------------------------------------------------------------

  describe('animal preservation', () => {
    test('multiple animal types across pastures preserved during rebuild', () => {
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
              { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], boar: 2 },
            ],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      // Build a new pasture at (2,2), adjacent to existing fences
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 2 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 7, // 10 - 3 (shares right border with existing)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [
              { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], boar: 2 },
              { spaces: [{ row: 2, col: 2 }] },
              { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 3 },
            ],
          },
          animals: { sheep: 3, boar: 2 },
        },
      })
    })

    test('boar in pasture preserved when adjacent pasture built', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 4 }], boar: 2 },
            ],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      // Build pasture at (2,3), adjacent to (2,4) with boar
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 7, // 10 - 3
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 3 }] },
              { spaces: [{ row: 2, col: 4 }], boar: 2 },
            ],
          },
          animals: { boar: 2 },
        },
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Splitting pastures (animal duplication regression)
  // ---------------------------------------------------------------------------

  describe('splitting pastures does not duplicate animals', () => {
    test('splitting a 2-space pasture with 1 boar does not duplicate it', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 1 },
            ],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      // Split: fence (2,3) as its own pasture, separating it from (2,4)
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      // The 1 boar should end up in one pasture, not both
      t.testBoard(game, {
        dennis: {
          wood: 9, // 10 - 1 (splitting fence)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 3 }], boar: 1 },
              { spaces: [{ row: 2, col: 4 }] },
            ],
          },
          animals: { boar: 1 },
        },
      })
    })

    test('splitting a 3-space pasture with 2 sheep distributes without duplicating', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 },
            ],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      // Split: fence (2,2) separately, leaving (2,3)+(2,4) together
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 2 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      // 2 sheep total: first sub-pasture (2,2) gets up to capacity 2, remainder goes to other
      t.testBoard(game, {
        dennis: {
          wood: 9,
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 2 }], sheep: 2 },
              { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] },
            ],
          },
          animals: { sheep: 2 },
        },
      })
    })

    test('splitting pasture with more animals than one sub-pasture can hold distributes across both', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: {
          wood: 10,
          food: 20,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], cattle: 3 },
            ],
          },
        },
        micah: { food: 20 },
      })
      game.run()

      // Split into two 1-space pastures (each capacity 2)
      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 3 }] })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      // 3 cattle split: first gets 2 (capacity), second gets 1
      t.testBoard(game, {
        dennis: {
          wood: 9,
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [
              { spaces: [{ row: 2, col: 3 }], cattle: 2 },
              { spaces: [{ row: 2, col: 4 }], cattle: 1 },
            ],
          },
          animals: { cattle: 3 },
        },
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Large pastures
  // ---------------------------------------------------------------------------

  describe('large pastures', () => {
    test('full bottom row as one pasture costs 12 wood', () => {
      const game = t.fixture()
      t.setBoard(game, {
        actionSpaces: ['Fencing'],
        firstPlayer: 'dennis',
        dennis: { wood: 15, food: 20 },
        micah: { food: 20 },
      })
      game.run()

      t.choose(game, 'Fencing')
      t.action(game, 'build-pasture', {
        spaces: [
          { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
          { row: 2, col: 3 }, { row: 2, col: 4 },
        ],
      })
      t.choose(game, 'Done building fences')

      t.choose(game, 'Day Laborer')
      t.choose(game, 'Grain Seeds')
      t.choose(game, 'Clay Pit')

      t.testBoard(game, {
        dennis: {
          wood: 3, // 15 - 12 (7 edge + 5 internal)
          food: 20,
          grain: 1,
          farmyard: {
            pastures: [{
              spaces: [
                { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
                { row: 2, col: 3 }, { row: 2, col: 4 },
              ],
            }],
          },
        },
      })
    })
  })
})
