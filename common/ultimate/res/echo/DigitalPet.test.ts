Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("DigitalPet", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Digital Pet'],
      },
      micah: {
        red: ['Coal', 'Metalworking'],
        yellow: ['Canning'],
        score: ['Mathematics', 'Paper', 'Industrialization'],
      },
      decks: {
        echo: {
          11: ['Drone'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Digital Pet')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Digital Pet'],
      },
      micah: {
        yellow: ['Canning'],
        hand: ['Drone'],
        score: ['Mathematics', 'Paper'],
      },
    })
  })
})
