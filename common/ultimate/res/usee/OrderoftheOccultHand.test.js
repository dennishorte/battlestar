Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Order of the Occult Hand', () => {

  test('dogma: you lose', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Order of the Occult Hand'],
        score: ['Optics'],
        hand: ['Railroad'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Order of the Occult Hand')

    t.testGameOver(request, 'micah', 'Order of the Occult Hand')
  })


  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Order of the Occult Hand'],
        score: ['Tools'],
        hand: ['Railroad'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Order of the Occult Hand')

    t.testGameOver(request, 'dennis', 'Order of the Occult Hand')
  })


  test('dogma: go crazy', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Order of the Occult Hand'],
        blue: ['Experimentation', 'Tools'],
        hand: [
          'Optics',
          'Atomic Theory',
          'Coal',
          'Flight',
          'Software',
          'Industrialization',
          'Reformation',
          'Mapmaking',
        ],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Order of the Occult Hand')
    request = t.choose(game, 'Software', 'Mapmaking')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Optics', 'Atomic Theory', 'Flight', 'Coal')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Order of the Occult Hand'],
        blue: {
          cards: ['Software', 'Experimentation', 'Tools'],
          splay: 'up',
        },
        green: ['Mapmaking'],
        score: ['Optics', 'Atomic Theory', 'Flight', 'Coal'],
        hand: ['Reformation', 'Industrialization'],
      },
    })
  })

})
