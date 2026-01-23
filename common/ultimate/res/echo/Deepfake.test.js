Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Deepfake", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal', 'Coke'],
        purple: ['Deepfake'],
      },
      micah: {
        red: ['Flight'],
        yellow: ['Esports'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Deepfake')
    request = t.choose(game, 'Flight')
    request = t.choose(game, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Coke'],
          splay: 'up',
        },
        purple: ['Deepfake'],
      },
      micah: {
        red: ['Flight'],
        yellow: ['Esports'],
      },
    })
  })

  test('dogma: no longer top card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal', 'Coke'],
        purple: ['Deepfake'],
      },
      micah: {
        yellow: ['Esports'],
        blue: ['Experimentation'],
      },
      decks: {
        echo: {
          5: ['Thermometer'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Deepfake')
    request = t.choose(game, 'Experimentation')
    request = t.choose(game, 'Experimentation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal', 'Coke'],
        blue: ['Thermometer', 'Experimentation'],
        purple: ['Deepfake'],
      },
      micah: {
        yellow: ['Esports'],
      },
    })
  })
})
