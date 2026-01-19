Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Mafia', () => {

  test('dogma: demand secrets; splay', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Mafia', 'Canning'],
      },
      micah: {
        safe: ['Tools', 'Optics'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mafia')
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Mafia', 'Canning'],
          splay: 'right',
        },
        safe: ['Tools'],
      },
      micah: {
        safe: ['Optics'],
      }
    })
  })

  test('dogma: tuck own card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Mafia'],
        score: ['Canning', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mafia')

    // Ensure card options are visible.
    t.testChoices(request, ['Canning', 'Tools'])

    request = t.choose(game, request, 'Canning')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Mafia', 'Canning'],
        score: ['Tools'],
      },
    })
  })

  test('dogma: tuck opponent card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Mafia'],
      },
      micah: {
        score: ['Canning', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mafia')
    request = t.choose(game, request, '**base-6* (micah)') // Extra star due to test utils
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Mafia', 'Canning'],
      },
      micah: {
        score: ['Tools'],
      }
    })
  })

})
