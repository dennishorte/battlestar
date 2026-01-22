const t = require('../../testutil.js')
const {
  GameOverEvent,
  InputRequestEvent,
} = require('../../../lib/game.js')


describe('Globalization', () => {
  test('demand', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization', 'Stem Cells', 'Fermenting'],
          splay: 'up',
        },
      },
      micah: {
        yellow: {
          cards: ['Agriculture', 'Statistics'],
          splay: 'left',
        },
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globalization')

    expect(t.cards(game, 'yellow', 'micah')).toEqual(['Statistics'])
  })

  test('draw and score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization', 'Stem Cells', 'Fermenting'],
          splay: 'up',
        },
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        },
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globalization')

    expect(t.cards(game, 'green')).toEqual(['Hypersonics'])
  })

  test('win condition (yes)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization'],
          splay: 'up',
        },
        score: ['Metalworking'],
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globalization')

    expect(request).toEqual(expect.any(GameOverEvent))
  })

  test('win condition (no)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization', 'Stem Cells', 'Fermenting'],
          splay: 'up',
        },
      },
      micah: {
        yellow: {
          cards: ['Agriculture', 'Statistics'],
          splay: 'left',
        },
      },
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globalization')

    expect(request).toEqual(expect.any(InputRequestEvent))
  })
})
