Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../../lib/game.js')

const t = require('./testutil_cube.js')


describe('CubeDraft', () => {

  test('game creation', () => {
    const game = t.fixture()
    const request1 = game.run()
    // If no errors thrown, success.
  })

  test('dennis pick', () => {
    const game = t.fixture()

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dennis', 'agility')

    t.testBoard(game, {
      dennis: {
        picked: ['agility'],
        waiting: [],
      },
      micah: {
        picked: [],
        waiting: ['micah-0', 'dennis-0'],
      },
    })
  })

})
