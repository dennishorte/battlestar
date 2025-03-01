Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sejong the Great', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Sejong the Great'],
      },
      decks: {
        base: {
          4: ['Reformation']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sejong the Great')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Sejong the Great'],
        purple: ['Reformation']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Sejong the Great', 'Advancement')
  })

  test('karma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Sejong the Great'],
      },
      decks: {
        base: {
          4: ['Experimentation'],
          5: ['Coal'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sejong the Great')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Sejong the Great'],
        red: ['Coal'],
      },
    })
  })
})
