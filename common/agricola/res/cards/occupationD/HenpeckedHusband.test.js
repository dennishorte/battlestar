const t = require('../../../testutil_v2.js')

describe('Henpecked Husband', () => {
  test('returns first worker when Farm Expansion is second action', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['henpecked-husband-d094'],
      },
    })
    game.run()

    // dennis: Day Laborer (+2 food)
    t.choose(game, 'Day Laborer')
    // micah: Forest
    t.choose(game, 'Forest')
    // dennis: Farm Expansion (can't build, auto-skips) — second person placed
    // HenpeckedHusband fires: first action was Day Laborer (not Meeting Place) → returns worker
    t.choose(game, 'Farm Expansion')
    // micah: Clay Pit
    t.choose(game, 'Clay Pit')
    // dennis: returned worker → Grain Seeds (+1 grain)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['henpecked-husband-d094'],
        food: 2,
        grain: 1,
      },
    })
  })

  test('does not return worker when first action was Meeting Place', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['henpecked-husband-d094'],
      },
    })
    game.run()

    // dennis: Meeting Place (minor improvement auto-skips since no minors in hand)
    t.choose(game, 'Meeting Place')
    // micah: Day Laborer
    t.choose(game, 'Day Laborer')
    // dennis: Farm Expansion (can't build, auto-skips) — second person placed
    // HenpeckedHusband checks: first action was Meeting Place → NO return
    t.choose(game, 'Farm Expansion')
    // micah: Forest
    t.choose(game, 'Forest')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['henpecked-husband-d094'],
        food: 1, // from Meeting Place
      },
    })
  })
})
