const t = require('../../../testutil_v2.js')

describe('Telegram', () => {
  test('schedules temporary worker based on fences in supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['telegram-a022'],
        food: 2,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Telegram')

    // 15 fences - 6 used for pasture = 9 in supply
    // targetRound = 1 + 9 = 10
    expect(game.state.telegramRounds.dennis).toBe(10)

    t.testBoard(game, {
      dennis: {
        food: 1,
        hand: [],
        minorImprovements: ['telegram-a022'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
    })
  })
})
