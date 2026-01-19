Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Hiking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Optics'],
        green: ['Hiking'],
      },
      decks: {
        usee: {
          6: ['Sniping'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hiking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Optics'],
        green: ['Hiking'],
        hand: ['Sniping'],
      },
    })
  })

  test('dogma: has f, one base card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hiking'],
        red: ['Gunpowder'],
      },
      decks: {
        base: {
          7: ['Railroad'],
        },
        usee: {
          6: ['Sniping'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hiking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hiking'],
        red: ['Gunpowder', 'Sniping'],
        hand: ['Railroad'],
      },
    })
  })

  test('dogma: has f, two base cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hiking'],
        red: ['Gunpowder'],
      },
      decks: {
        base: {
          7: ['Lighting'],
          8: ['Flight'],
        },
        usee: {
          6: ['Sniping'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hiking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hiking'],
        red: ['Gunpowder', 'Sniping'],
        purple: ['Lighting'],
        hand: ['Flight'],
      },
    })
  })

})
