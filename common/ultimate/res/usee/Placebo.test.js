Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Placebo', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Placebo'],
        red: ['Combustion', 'Optics', 'Explosives', 'Gunpowder'],
      },
      decks: {
        base: {
          7: ['Lighting', 'Railroad'],
        },
        usee: {
          7: ['Mafia'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Placebo')
    request = t.choose(game, request, 'Combustion')
    request = t.choose(game, request, 'Optics')
    request = t.choose(game, request, 'Explosives')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Placebo'],
        red: ['Gunpowder'],
        hand: ['Mafia', 'Lighting', 'Railroad']
      },
    })
  })

  test('dogma: exactly one seven', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Placebo'],
        red: ['Combustion', 'Optics', 'Gunpowder'],
      },
      decks: {
        base: {
          7: ['Lighting'],
          8: ['Flight'],
        },
        usee: {
          7: ['Mafia'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Placebo')
    request = t.choose(game, request, 'Combustion')
    request = t.choose(game, request, 'Optics')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Placebo'],
        red: ['Gunpowder'],
        hand: ['Mafia', 'Lighting', 'Flight'],
      },
    })
  })

})
