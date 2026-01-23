Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Noodles", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Noodles'],
        hand: ['Sailing', 'Domestication', 'Gunpowder'],
      },
      micah: {
        hand: ['Tools', 'Astronomy', 'Enterprise'],
      },
      decks: {
        echo: {
          1: ['Candles'],
          2: ['Lever'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Noodles')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Noodles'],
        hand: ['Sailing', 'Domestication', 'Gunpowder', 'Candles'],
        score: ['Lever'],
      },
      micah: {
        hand: ['Tools', 'Astronomy', 'Enterprise'],
      },
    })
  })

  test('dogma: equal {1}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Noodles'],
        hand: ['Domestication', 'Gunpowder'],
      },
      micah: {
        hand: ['Tools', 'Astronomy', 'Enterprise'],
      },
      decks: {
        echo: {
          1: ['Candles'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Noodles')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Noodles'],
        hand: ['Domestication', 'Gunpowder', 'Candles'],
      },
      micah: {
        hand: ['Tools', 'Astronomy', 'Enterprise'],
      },
    })
  })

  test('dogma: draw yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Noodles'],
        hand: ['Sailing', 'Domestication', 'Gunpowder'],
      },
      micah: {
        hand: ['Tools', 'Astronomy', 'Enterprise'],
      },
      decks: {
        echo: {
          1: ['Chopsticks'],
          2: ['Lever'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Noodles')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Noodles'],
        hand: ['Gunpowder'],
        score: ['Domestication', 'Lever', 'Chopsticks', 'Sailing'],
      },
      micah: {
        hand: ['Tools', 'Astronomy', 'Enterprise'],
      },
    })
  })
})
