Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Almanac", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Machinery'],
        blue: ['Almanac'],
        forecast: ['Horseshoes'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
        echo: {
          4: ['Toilet'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Almanac')
    request = t.choose(game, 'Horseshoes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Machinery'],
        blue: ['Almanac'],
        score: ['Engineering'],
        forecast: ['Toilet'],
      },
    })
  })

  test('dogma: was forseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Machinery'],
        forecast: ['Horseshoes', 'Almanac'],
      },
      micah: {
        forecast: ['Software'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
        echo: {
          4: ['Toilet'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Machinery')
    request = t.choose(game, 'Almanac')
    request = t.choose(game, 'Horseshoes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Machinery'],
        blue: ['Almanac'],
        score: ['Engineering'],
        forecast: ['Toilet', 'Software'],
      },
    })
  })
})
