Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Susan Blackmore', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Susan Blackmore'],
        green: ['Email'],
      },
      micah: {
        blue: {
          cards: ['Stephen Hawking', 'Daedalus'],
          splay: 'right'
        }
      },
      decks: {
        base: {
          1: ['Tools'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.blue')

    t.testChoices(request, [
      "Email: Draw and foreshadow a {0}.",
      "Stephen Hawking: Score the bottom card of this color.",
      "Stephen Hawking: Draw and tuck a {0}.",
      "Daedalus: Draw and foreshadow a {4}.",
      "Daedalus: Score the bottom card of this color."
    ])

    request = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose',
      selection: ['Daedalus: Score the bottom card of this color.'],
    })

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        score: ['Susan Blackmore'],
        green: ['Email'],
        hand: ['Tools'],
      },
      micah: {
        blue: {
          cards: ['Stephen Hawking', 'Daedalus'],
          splay: 'right'
        }
      },
    })
  })

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Experimentation'],
      },
      micah: {
        blue: ['Susan Blackmore'],
      },
      decks: {
        base: {
          5: ['Coal'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Experimentation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
      },
      micah: {
        blue: ['Susan Blackmore'],
        score: ['Experimentation'],
      },
    })
  })
})
