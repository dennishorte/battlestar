Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Thermometer", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Thermometer'],
        purple: ['Astronomy'],
        green: {
          cards: ['Sailing', 'Navigation'],
          splay: 'left'
        },
        yellow: ['Fermenting'],
      },
      decks: {
        base: {
          3: ['Machinery'],
          4: ['Gunpowder'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Thermometer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Thermometer'],
        purple: ['Astronomy'],
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left'
        },
        yellow: ['Machinery', 'Fermenting'],
        red: ['Gunpowder'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: {
          cards: ['Sailing', 'Navigation'],
          splay: 'left'
        },
        yellow: ['Fermenting'],
        hand: ['Astronomy'],
        forecast: ['Thermometer'],
      },
      decks: {
        base: {
          3: ['Machinery'],
          4: ['Gunpowder', 'Experimentation'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Astronomy')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation', 'Thermometer'],
        purple: ['Astronomy'],
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left'
        },
        yellow: ['Machinery', 'Fermenting'],
        red: ['Gunpowder'],
      },
    })
  })

  test('dogma: no yellow card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Thermometer'],
        green: {
          cards: ['Sailing', 'Navigation'],
          splay: 'left'
        },
        purple: ['Astronomy'],
      },
      decks: {
        base: {
          1: ['Metalworking']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Thermometer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Thermometer'],
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left'
        },
        red: ['Metalworking'],
        purple: ['Astronomy'],
      },
    })
  })
})
