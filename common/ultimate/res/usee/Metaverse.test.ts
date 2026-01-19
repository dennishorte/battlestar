Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Metaverse', () => {

  test('dogma: score three', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Metaverse', 'Reformation', 'Monotheism'],
          splay: 'left',
        },
        green: {
          cards: ['Paper', 'The Wheel', 'Navigation'],
          splay: 'right',
        },
        yellow: {
          cards: ['Canning', 'Agriculture', 'Perspective'],
          splay: 'up',
        },
        red: ['Flight', 'Metalworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Metaverse')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Reformation', 'Monotheism'],
          splay: 'left',
        },
        green: {
          cards: ['The Wheel', 'Navigation'],
          splay: 'right',
        },
        yellow: {
          cards: ['Agriculture', 'Perspective'],
          splay: 'up',
        },
        red: ['Flight', 'Metalworking'],
        score: ['Metaverse', 'Paper', 'Canning'],
      },
    })
  })

  test('dogma: you lose', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Metaverse', 'Reformation', 'Monotheism'],
          splay: 'left',
        },
        green: {
          cards: ['Paper', 'The Wheel', 'Navigation'],
          splay: 'right',
        },
        red: ['Flight', 'Metalworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Metaverse')
    request = t.choose(game, request, 'auto')

    t.testGameOver(request, 'micah', 'Metaverse')
  })

})
