Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Ride-Hailing', () => {

  test('dogma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ride-Hailing'],
        green: ['Databases', 'The Wheel'],
        blue: ['Software'],

      },
      micah: {
        yellow: ['Escape Room'],
        blue: ['Genetics'],
        red: ['Fission'],
      },
      decks: {
        usee: {
          10: ['Hacking'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ride-Hailing')
    request = t.choose(game, request, 'green')
    request = t.choose(game, request, 'Escape Room')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Fission'],
        yellow: ['Ride-Hailing'],
        green: {
          cards: ['Databases', 'The Wheel'],
          splay: 'up',
        },
        blue: ['Software'],
        hand: ['Hacking'],
      },
      micah: {
        blue: ['Genetics'],
      },
    })
  })

  test('dogma: no meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ride-Hailing'],
        green: ['Databases', 'The Wheel'],
        blue: ['Software'],

      },
      micah: {
        yellow: ['Escape Room'],
        blue: ['Genetics'],
      },
      decks: {
        usee: {
          11: ['Metaverse'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ride-Hailing')
    request = t.choose(game, request, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ride-Hailing'],
        green: {
          cards: ['Databases', 'The Wheel'],
          splay: 'up',
        },
        blue: ['Software'],
        hand: ['Metaverse'],
      },
      micah: {
        yellow: ['Escape Room'],
        blue: ['Genetics'],
      },
    })
  })

})
