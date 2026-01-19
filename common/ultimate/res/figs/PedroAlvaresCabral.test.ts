Error.stackTraceLimit = 100
import t from '../../testutil.js'

describe('Pedro Alvarez Cabral', () => {
  test('karma: decree', () => {
    t.testDecreeForTwo('Pedro Alvarez Cabral', 'Trade')
  })

  describe('If you would dogma a {1}, instead claim the World achievement. If you can\'t, and Monotheism is a top card on your board, you win.', () => {
    test('karma: dogma a {1}, claim World achievement', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Pedro Alvarez Cabral'],
          red: ['Archery'], // Age 1 card to dogma
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Pedro Alvarez Cabral'],
          red: ['Archery'], // Archery still on board (dogma did not execute)
          achievements: ['World'], // World achievement was claimed
        },
      })
    })

    test('karma: dogma a {1}, cannot claim World, Monotheism on board, you win', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Pedro Alvarez Cabral'],
          red: ['Archery'], // Age 1 card to dogma
          purple: ['Monotheism'], // Monotheism on board
          achievements: ['World'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')

      t.testGameOver(request, 'dennis', 'Pedro Alvarez Cabral')
    })

    test('karma: dogma a {1}, cannot claim World, Monotheism not on board', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Pedro Alvarez Cabral'],
          red: ['Archery'], // Age 1 card to dogma
        },
        junk: ['World'],
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Archery')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Pedro Alvarez Cabral'],
          red: ['Archery'], // Archery still on board (dogma did not execute)
        },
      })
    })

    test('karma: does not trigger when dogmatizing non-{1} card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Pedro Alvarez Cabral'],
          blue: ['Mathematics'],
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Mathematics')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Pedro Alvarez Cabral'],
          blue: ['Mathematics'],
        },
      })
    })
  })

})
