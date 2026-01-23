Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Robocar", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Robocar'],
        hand: ['Lightning Rod', 'Experimentation'],
      },
      micah: {
        red: ['Coal'],
        hand: ['Bangle', 'Domestication'],
      },
      decks: {
        echo: {
          5: ['Piano', 'Stove'],
          11: ['Algocracy'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Robocar')
    request = t.choose(game, '**base-1* (micah)')
    request = t.choose(game, '**base-4* (dennis)')
    request = t.choose(game, 'Lightning Rod')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Stove'],
        green: ['Robocar'],
        blue: ['Experimentation'],
        purple: ['Piano'],
        hand: ['Algocracy'], // Sharing bonus
      },
      micah: {
        red: ['Coal'],
        yellow: ['Domestication'],
        hand: ['Bangle'],
      },
    })
  })
})
