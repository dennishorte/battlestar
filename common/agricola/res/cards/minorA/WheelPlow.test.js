const t = require('../../../testutil_v2.js')

describe('Wheel Plow', () => {
  test('plows 2 additional fields on Farmland action with first worker', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['wheel-plow-a018'],
      },
    })
    game.run()

    // Dennis takes Farmland (plow-field) with his first worker
    // Farmland plows 1 field, then WheelPlow triggers 2 more
    t.choose(game, 'Farmland')
    t.choose(game, '0,2') // from Farmland action
    t.choose(game, '0,3') // from Wheel Plow (1st additional)
    t.choose(game, '0,4') // from Wheel Plow (2nd additional)

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['wheel-plow-a018'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
  })

  test('only triggers once per game (wheelPlowUsed flag)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['wheel-plow-a018'],
      },
    })
    game.run()

    // Round 1: Dennis takes Farmland → WheelPlow triggers (3 fields total)
    t.choose(game, 'Farmland')
    t.choose(game, '0,2')
    t.choose(game, '0,3')
    t.choose(game, '0,4')
    t.choose(game, 'Day Laborer')     // micah
    t.choose(game, 'Grain Seeds')     // dennis
    t.choose(game, 'Fishing')         // micah

    // Round 2: Dennis takes Farmland again → WheelPlow does NOT trigger (used)
    t.choose(game, 'Farmland')
    t.choose(game, '1,2') // only 1 field from Farmland (adjacent to 0,2), no extras

    t.testBoard(game, {
      dennis: {
        grain: 1, // from Grain Seeds
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['wheel-plow-a018'],
        farmyard: {
          fields: [
            { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 2 },
          ],
        },
      },
    })
  })
})
