const t = require('../../../testutil_v2.js')

describe('Heresy Teacher', () => {
  test('onAction places vegetables under grain for fields with 3+ grain when using Lessons', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Lessons A'],
      dennis: {
        occupations: ['heresy-teacher-a113'],
        vegetables: 0,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 1, col: 2, crop: 'grain', cropCount: 4 },
            { row: 2, col: 2, crop: 'grain', cropCount: 2 }, // Only 2 grain, not eligible
          ],
        },
      },
    })
    game.run()

    // Use Lessons A action (no occupations in hand, so no prompt)
    t.choose(game, 'Lessons A')

    t.testBoard(game, {
      dennis: {
        occupations: ['heresy-teacher-a113'],
        vegetables: 0, // Vegetables are placed under grain, not in supply
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3, underCrop: 'vegetables', underCropCount: 1 },
            { row: 1, col: 2, crop: 'grain', cropCount: 4, underCrop: 'vegetables', underCropCount: 1 },
            { row: 2, col: 2, crop: 'grain', cropCount: 2 }, // Not eligible (only 2 grain)
          ],
        },
      },
    })
  })

  test('onAction does not give vegetables for fields with < 3 grain', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Lessons A'],
      dennis: {
        occupations: ['heresy-teacher-a113'],
        vegetables: 0,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 1, col: 2, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')

    t.testBoard(game, {
      dennis: {
        occupations: ['heresy-teacher-a113'],
        vegetables: 0, // No fields with 3+ grain, so no vegetables placed
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 }, // Not eligible (< 3 grain)
            { row: 1, col: 2, crop: 'grain', cropCount: 1 }, // Not eligible (< 3 grain)
          ],
        },
      },
    })
  })

  test('onAction does not place vegetables for fields that already have vegetables underneath', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Lessons A'],
      dennis: {
        occupations: ['heresy-teacher-a113'],
        vegetables: 0,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 1, col: 2, crop: 'grain', cropCount: 4, underCrop: 'vegetables', underCropCount: 1 }, // Already has vegetable underneath
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')

    t.testBoard(game, {
      dennis: {
        occupations: ['heresy-teacher-a113'],
        vegetables: 0, // Vegetables are placed under grain, not in supply
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3, underCrop: 'vegetables', underCropCount: 1 }, // Only this field gets vegetable
            { row: 1, col: 2, crop: 'grain', cropCount: 4, underCrop: 'vegetables', underCropCount: 1 }, // Already had vegetable, unchanged
          ],
        },
      },
    })
  })

  test('vegetable placed under grain becomes primary crop when grain is exhausted', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 3, // Round 3, so round 4 (first harvest) is next
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['heresy-teacher-a113'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 3: Use Lessons A to trigger Heresy Teacher
    t.choose(game, 'Lessons A')

    // Verify underCrop is set
    let dennis = game.players.byName('dennis')
    let fieldSpace = dennis.getSpace(0, 2)
    expect(fieldSpace.underCrop).toBe('vegetables')
    expect(fieldSpace.underCropCount).toBe(1)

    // Complete round 3 with other actions
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Round 4: First harvest
    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // After first harvest: grain goes from 3 to 2, vegetable still underneath
    dennis = game.players.byName('dennis')
    fieldSpace = dennis.getSpace(0, 2)
    expect(fieldSpace.crop).toBe('grain')
    expect(fieldSpace.cropCount).toBe(2)
    expect(fieldSpace.underCrop).toBe('vegetables')
    expect(fieldSpace.underCropCount).toBe(1)

    // Round 5-6: Continue playing
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')    // micah

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Round 7: Second harvest
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')    // micah

    // After second harvest: grain goes from 2 to 1, vegetable still underneath
    dennis = game.players.byName('dennis')
    fieldSpace = dennis.getSpace(0, 2)
    expect(fieldSpace.crop).toBe('grain')
    expect(fieldSpace.cropCount).toBe(1)
    expect(fieldSpace.underCrop).toBe('vegetables')
    expect(fieldSpace.underCropCount).toBe(1)

    // Round 8-9: Continue playing
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')    // micah

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Round 9: Third harvest
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')    // micah

    // After third harvest: grain goes from 1 to 0, vegetable becomes primary crop
    dennis = game.players.byName('dennis')
    fieldSpace = dennis.getSpace(0, 2)
    expect(fieldSpace.crop).toBe('vegetables')
    expect(fieldSpace.cropCount).toBe(1)
    expect(fieldSpace.underCrop).toBeUndefined()
    expect(fieldSpace.underCropCount).toBeUndefined()
  })
})
