const t = require('../../../testutil_v2.js')

describe('Pond Hut', () => {
  test('schedules food on next 3 rounds when played', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['pond-hut-a044'],
        wood: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Pond Hut')

    t.testBoard(game, {
      dennis: {
        food: 1,
        hand: [],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['pond-hut-a044'],
        scheduled: { food: { 2: 1, 3: 1, 4: 1 } },
      },
    })
  })
})
