Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Illuminati', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Illuminati', 'Monotheism', 'Code of Laws'],
        hand: ['Reformation']
      },
      achievements: ['Lighting'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Illuminati')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Monotheism', 'Code of Laws'],
          splay: 'right',
        },
        hand: ['Reformation'],
        safe: ['Illuminati', 'Lighting'],
      },
    })
  })

  test('dogma - revealed color not on board', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Illuminati'],
        hand: ['Mathematics'],  // yellow, not on board
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Illuminati')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Illuminati'],
        hand: ['Mathematics'],
      },
    })
  })

  test('dogma - full safe', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Illuminati', 'Monotheism', 'Code of Laws'],
        hand: ['Reformation'],
        safe: ['Domestication', 'Agriculture', 'Writing', 'Pottery', 'Mathematics'],
      },
      achievements: ['Lighting'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Illuminati')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Illuminati', 'Monotheism', 'Code of Laws'],
          splay: 'right',
        },
        hand: ['Reformation'],
        safe: ['Domestication', 'Agriculture', 'Writing', 'Pottery', 'Mathematics'],
      },
    })
  })

})
