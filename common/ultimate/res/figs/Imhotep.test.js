Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Imhotep', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Imhotep'],
      },
      decks: {
        base: {
          2: ['Fermenting']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Imhotep')

    t.testBoard(game, {
      dennis: {
        blue: ['Imhotep'],
        yellow: ['Fermenting']
      },
    })
  })

  test('karma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery', 'Oars'],
        blue: ['Imhotep'],
        hand: ['Construction']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Construction')

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Archery', 'Oars'],
          splay: 'left'
        },
        blue: ['Imhotep'],
      },
    })
  })


  test('karma: meld (already splayed)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Archery', 'Oars'],
          splay: 'left'
        },
        blue: ['Imhotep'],
        hand: ['Construction']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Construction')

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery', 'Oars'],
          splay: 'left'
        },
        blue: ['Imhotep'],
      },
    })
  })

  test('karma: meld (not enough cards)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        blue: ['Imhotep'],
        hand: ['Construction']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Construction')

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'none',
        },
        blue: ['Imhotep'],
      },
    })
  })
})
