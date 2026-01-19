Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Where's Waldo", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Where's Waldo"],
      },
      micah: {
        yellow: ['Agriculture'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'micah', "Where's Waldo")
  })
})
