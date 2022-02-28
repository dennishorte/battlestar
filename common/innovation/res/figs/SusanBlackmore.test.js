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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.blue')

    t.testChoices(request2, [
      "Email: Draw and foreshadow a {0}.",
      "Stephen Hawking: Score the bottom card of this color.",
      "Stephen Hawking: Draw and tuck a {0}.",
      "Daedalus: Draw and foreshadow a {4}.",
      "Daedalus: Score the bottom card of this color."
    ])

    const request3 = game.respondToInputRequest({
      actor: 'dennis',
      title: 'Choose',
      selection: ['Daedalus: Score the bottom card of this color.'],
      key: request1.key,
    })

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Experimentation')

    t.testIsSecondPlayer(request2)
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
