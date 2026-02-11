const t = require('../../../testutil_v2.js')

describe('Shaving Horse', () => {
  test('mandatory exchange with 7+ wood after taking Forest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['shaving-horse-a048'],
        wood: 4, // +3 from Forest = 7, triggers mandatory exchange
      },
    })
    game.run()

    // Round 1: dennis takes Forest (+3 wood = 7 → mandatory exchange: -1 wood +3 food)
    t.choose(game, 'Forest')           // dennis
    t.choose(game, 'Grain Seeds')      // micah
    t.choose(game, 'Day Laborer')      // dennis
    t.choose(game, 'Clay Pit')         // micah

    t.testBoard(game, {
      dennis: {
        wood: 6, // 4 + 3 - 1 (mandatory)
        food: 5, // 3 (shaving horse) + 2 (Day Laborer)
        minorImprovements: ['shaving-horse-a048'],
      },
    })
  })

  test('optional exchange with 5-6 wood after taking Forest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['shaving-horse-a048'],
        wood: 2, // +3 from Forest = 5, triggers optional offer
      },
    })
    game.run()

    // Round 1: dennis takes Forest (+3 wood = 5 → optional offer)
    t.choose(game, 'Forest')           // dennis
    t.choose(game, 'Exchange 1 wood for 3 food')
    t.choose(game, 'Grain Seeds')      // micah
    t.choose(game, 'Day Laborer')      // dennis
    t.choose(game, 'Clay Pit')         // micah

    t.testBoard(game, {
      dennis: {
        wood: 4, // 2 + 3 - 1 (exchange)
        food: 5, // 3 (shaving horse) + 2 (Day Laborer)
        minorImprovements: ['shaving-horse-a048'],
      },
    })
  })

  test('can skip optional exchange', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['shaving-horse-a048'],
        wood: 2, // +3 from Forest = 5
      },
    })
    game.run()

    t.choose(game, 'Forest')           // dennis
    t.choose(game, 'Skip')
    t.choose(game, 'Grain Seeds')      // micah
    t.choose(game, 'Day Laborer')      // dennis
    t.choose(game, 'Clay Pit')         // micah

    t.testBoard(game, {
      dennis: {
        wood: 5, // 2 + 3 (no exchange)
        food: 2, // Day Laborer only
        minorImprovements: ['shaving-horse-a048'],
      },
    })
  })
})
