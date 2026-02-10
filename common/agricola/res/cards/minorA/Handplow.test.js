const t = require('../../../testutil_v2.js')

describe('Handplow', () => {
  test('schedules a plow event 5 rounds from current', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['handplow-a019'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Handplow')

    t.testBoard(game, {
      dennis: {
        food: 1,
        hand: [],
        minorImprovements: ['handplow-a019'],
        scheduled: { plows: [7] },
      },
    })
  })
})
