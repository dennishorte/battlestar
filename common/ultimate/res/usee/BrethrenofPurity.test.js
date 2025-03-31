Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Brethren of Purity', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Brethren of Purity'],
        red: ['Archery'],
      },
      decks: {
        base: {
          4: ['Reformation'],
        },
        usee: {
          3: ['Knights Templar']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Brethren of Purity')
    request = t.choose(game, request, 4)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Brethren of Purity'],
        red: ['Knights Templar', 'Archery'],
        purple: ['Reformation'],
      },
    })
  })

  test('dogma: carries across endorse', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee', 'city'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Brethren of Purity'],
        red: ['Thebes'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          4: ['Reformation'],
        },
        usee: {
          3: ['Masquerade']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Endorse.blue')
    request = t.choose(game, request, 4)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Brethren of Purity'],
        red: ['Thebes'],
        purple: ['Reformation', 'Masquerade'],
      },
    })
  })

})
