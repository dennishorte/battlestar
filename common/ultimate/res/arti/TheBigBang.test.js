Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("The Big Bang", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Big Bang"],
        blue: ['Mathematics'],
        hand: ['Societies'],
      },
      decks: {
        base: {
          6: ['Encyclopedia'],
          10: ['Software'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Societies')
    request = t.choose(game)

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Encyclopedia', 'Mathematics'],
        museum: ['Museum 1', 'The Big Bang'],
      },
      junk: ['Software'],
    })
  })

  test('dogma: unsplay is a change and repeats', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti', 'usee'] })
    t.setBoard(game, {
      dennis: {
        artifact: ['The Big Bang'],
        blue: ['Blacklight'],
        yellow: {
          cards: ['Agriculture', 'Domestication'],
          splay: 'left',
        },
      },
      decks: {
        usee: {
          10: ['Hacking'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Unsplay.yellow')

    // Blacklight's unsplay is a change, so The Big Bang draws and junks a 10
    // and repeats. The next prompt is Blacklight again, not the next action.
    expect(request.selectors[0].title).not.toBe('Choose First Action')
    t.testBoard(game, {
      dennis: {
        artifact: ['The Big Bang'],
        blue: ['Blacklight'],
        yellow: ['Agriculture', 'Domestication'],
      },
      junk: ['Hacking'],
    })
  })
})
