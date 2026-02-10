const t = require('../../../testutil_v2.js')

describe('Clay Embankment', () => {
  test('gives bonus clay on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['clay-embankment-a005'],
        food: 1, // cost of Clay Embankment
        clay: 5,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Clay Embankment')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place, -1 cost
        clay: 7, // 5 + floor(5/2) = 7
        hand: [],
      },
      micah: {
        hand: ['clay-embankment-a005'], // passLeft
      },
    })
  })

  test('gives nothing with 0-1 clay', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['clay-embankment-a005'],
        food: 1, // cost of Clay Embankment
        clay: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Clay Embankment')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place, -1 cost
        clay: 1, // floor(1/2) = 0, so still 1
        hand: [],
      },
      micah: {
        hand: ['clay-embankment-a005'], // passLeft
      },
    })
  })
})
