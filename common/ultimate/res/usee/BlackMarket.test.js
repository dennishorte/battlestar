Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Black Market', () => {

  test('dogma: cannot meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Black Market'],
        hand: ['Optics'],
      },
      achievements: ['Lighting', 'Canning', 'Whataboutism'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Black Market')
    request = t.choose(game, request, 'Optics')
    request = t.choose(game, request, '**base-7*', '**base-11*')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Black Market'],
        safe: ['Optics'],
      },
    })
  })

  test('dogma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Black Market'],
        hand: ['Optics'],
      },
      achievements: ['Lighting', 'Canning', 'Whataboutism'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Black Market')
    request = t.choose(game, request, 'Optics')
    request = t.choose(game, request, '**base-7*', '**base-6*')
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Black Market'],
        yellow: ['Canning'],
        safe: ['Optics'],
      },
    })
  })

})
