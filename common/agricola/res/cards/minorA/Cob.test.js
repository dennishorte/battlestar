const t = require('../../../testutil_v2.js')

describe('Cob', () => {
  test('exchanges grain for clay and food at work phase start', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cob-a076'],
        clay: 1,
        grain: 1,
      },
    })
    game.run()

    // Work phase starts → Cob fires → offer exchange
    t.choose(game, 'Exchange 1 grain for 2 clay and 1 food')

    // Round 1: all 4 workers take actions
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    t.testBoard(game, {
      dennis: {
        food: 4, // 1 (Cob) + 2 (Day Laborer) + 1 (Fishing)
        clay: 3, // 1 + 2 (Cob)
        grain: 0, // spent on Cob
        minorImprovements: ['cob-a076'],
      },
    })
  })

  test('can skip the cob offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cob-a076'],
        clay: 1,
        grain: 1,
      },
    })
    game.run()

    t.choose(game, 'Skip')

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Fishing')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 (Day Laborer) + 1 (Fishing)
        clay: 1, // unchanged
        grain: 1, // not spent
        minorImprovements: ['cob-a076'],
      },
    })
  })
})
