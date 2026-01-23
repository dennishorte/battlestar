Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cliffhanger', () => {

  test('dogma: no fours', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        safe: ['Machinery', 'Coal']
      },
      decks: {
        base: {
          4: ['Reformation'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cliffhanger')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        safe: ['Machinery', 'Coal', 'Reformation'],
      },
    })
  })

  test('dogma: green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        safe: ['Navigation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cliffhanger')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cliffhanger', 'Navigation'],
      },
    })
  })

  test('dogma: purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        purple: ['Monotheism'],
        safe: ['Reformation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cliffhanger')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        purple: ['Reformation', 'Monotheism'],
      },
    })
  })

  test('dogma: red', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        safe: ['Gunpowder'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cliffhanger')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        achievements: ['Gunpowder'],
      },
    })
  })

  test('dogma: yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        safe: ['Perspective'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cliffhanger')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        score: ['Perspective'],
      },
    })
  })

  test('dogma: blue', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        safe: ['Experimentation'],
      },
      decks: {
        usee: {
          5: ['Cabal'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cliffhanger')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cliffhanger'],
        safe: ['Experimentation'],
        hand: ['Cabal'],
      },
    })
  })

})
