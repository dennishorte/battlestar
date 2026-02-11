const t = require('../../../testutil_v2.js')

describe('Beer Keg', () => {
  test('exchanges grain for food during harvest feeding phase', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 4, // first harvest
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['beer-keg-a062'],
        grain: 2,
        food: 10, // enough to feed family
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Round 4: all 4 workers
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    // Harvest → Feeding Phase → Beer Keg fires → offer exchange
    t.choose(game, 'Exchange 2 grain for 3 food and 1 bonus point')

    t.testBoard(game, {
      dennis: {
        food: 12, // 10 + 2 (Day Laborer) + 1 (Fishing) + 3 (Beer Keg) - 4 (feed 2 members)
        grain: 0, // 2 - 2 (Beer Keg)
        bonusPoints: 1,
        minorImprovements: ['beer-keg-a062'],
      },
    })
  })

  test('can skip beer keg offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['beer-keg-a062'],
        grain: 2,
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Fishing')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 9, // 10 + 2 (Day Laborer) + 1 (Fishing) - 4 (feed)
        grain: 2, // unchanged
        minorImprovements: ['beer-keg-a062'],
      },
    })
  })
})
