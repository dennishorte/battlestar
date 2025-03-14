Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Quantum Computers', () => {

  test('dogma: nothing happens', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quantum Computers'],
        safe: ['Tools'],
      },
    })

    game.testSetBreakpoint('initialization-complete', (game) => {
      game.random = () => 0.2
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Quantum Computers')
    request = t.choose(game, request, 'heads') // Micah doesn't lose
    request = t.choose(game, request, 'heads') // Dennis ends the effect

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Computers'],
        safe: ['Tools'],
      },
    })
  })

  test('dogma: opponent loses', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quantum Computers'],
        safe: ['Tools'],
      },
    })

    game.testSetBreakpoint('initialization-complete', (game) => {
      game.random = () => 0.2
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Quantum Computers')
    request = t.choose(game, request, 'tails')

    t.testGameOver(request, 'dennis', 'Quantum Computers')
  })

  test('dogma: player loses, after returning a secret', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quantum Computers'],
        safe: ['Tools'],
      },
    })

    game.testSetBreakpoint('initialization-complete', (game) => {
      game.random = () => 0.2
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Quantum Computers')
    request = t.choose(game, request, 'heads') // Micah doesn't lose
    request = t.choose(game, request, 'tails')
    request = t.choose(game, request, 'tails')

    t.testGameOver(request, 'micah', 'Quantum Computers')
  })

})
