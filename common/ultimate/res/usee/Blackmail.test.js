Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Blackmail', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Blackmail'],
      },
      micah: {
        hand: ['Mathematics', 'Tools'],
        score: ['Agriculture'],
      },
      decks: {
        usee: {
          2: ['Astrology'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Blackmail')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Mathematics')
    request = t.choose(game, 'Agriculture')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Blackmail'],
      },
      micah: {
        blue: ['Mathematics'],
        score: ['Agriculture', 'Astrology'],
      },
    })
  })

})
