const t = require('../../../testutil_v2.js')

describe('Bassinet', () => {
  test('allows using first non-accumulating space occupied by another player', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['bassinet-a025'],
      },
      actionSpaces: ['Day Laborer', 'Forest'],
    })
    game.run()

    // micah takes Day Laborer (first non-accumulating action)
    t.choose(game, 'Day Laborer')

    // dennis can also take Day Laborer via Bassinet
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2, // from Day Laborer
        minorImprovements: ['bassinet-a025'],
      },
      micah: {
        food: 2, // from Day Laborer
      },
    })
  })

  test('allows reusing own first non-accumulating space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['bassinet-a025'],
      },
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds'],
    })
    game.run()

    // dennis takes Day Laborer (first non-accumulating action)
    t.choose(game, 'Day Laborer')

    // micah takes Forest (accumulating, doesn't affect tracking)
    t.choose(game, 'Forest')

    // dennis can take Day Laborer again via Bassinet
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 4, // 2 + 2 from Day Laborer twice
        minorImprovements: ['bassinet-a025'],
      },
      micah: {
        wood: 3, // from Forest
      },
    })
  })

  test('does not allow using a different non-accumulating space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['bassinet-a025'],
      },
      actionSpaces: ['Day Laborer', 'Grain Seeds', 'Forest'],
    })
    game.run()

    // micah takes Day Laborer (first non-accumulating action)
    t.choose(game, 'Day Laborer')

    // dennis takes Grain Seeds (second non-accumulating — NOT eligible for Bassinet)
    t.choose(game, 'Grain Seeds')

    // micah takes Forest (accumulating)
    t.choose(game, 'Forest')

    // dennis's last worker goes to Forest — Grain Seeds (2nd non-accumulating)
    // was NOT eligible for Bassinet, only Day Laborer (1st) would have been
    t.testBoard(game, {
      dennis: {
        grain: 1, // from Grain Seeds
        minorImprovements: ['bassinet-a025'],
      },
      micah: {
        food: 2, // from Day Laborer
        wood: 3, // from Forest
      },
    })
  })
})
