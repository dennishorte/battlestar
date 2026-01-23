Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Stethoscope", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Stethoscope'],
        yellow: ['Agriculture'],
        hand: ['Canning'],
      },
      decks: {
        base: {
          7: ['Combustion'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Stethoscope')
    request = t.choose(game, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Stethoscope'],
        yellow: {
          cards: ['Canning', 'Agriculture'],
          splay: 'right'
        },
        hand: ['Combustion'],
      },
    })
  })

  test('dogma: meld blue', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Stethoscope'],
        hand: ['Atomic Theory'],
      },
      decks: {
        echo: {
          7: ['Rubber'],
          8: ['Nylon'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Stethoscope')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Atomic Theory', 'Stethoscope'],
        hand: ['Rubber', 'Nylon'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Atomic Theory', 'Lighting'],
        forecast: ['Stethoscope'],
      },
      decks: {
        echo: {
          7: ['Rubber'],
          8: ['Nylon'],
          9: ['Email'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Lighting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Atomic Theory', 'Stethoscope'],
        purple: ['Lighting'],
        hand: ['Rubber', 'Nylon', 'Email'],
      },
    })
  })
})
