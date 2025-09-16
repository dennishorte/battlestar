Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Leonardo Da Vinci', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Leonardo Da Vinci'],
      },
      micah: {
        purple: ['Homer'],
        green: ['Fu Xi'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Leonardo Da Vinci')

    t.testChoices(request, ['Homer', 'Leonardo Da Vinci'])

    request = t.choose(game, request, 'Homer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Leonardo Da Vinci'],
        score: ['Homer'],
      },
      micah: {
        green: ['Fu Xi'],
      }
    })
  })

  test('karma: meld purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Leonardo Da Vinci'],
        hand: ['Monotheism']
      },
      decks: {
        base: {
          4: ['Gunpowder', 'Enterprise', 'Reformation']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Monotheism')

    t.testBoard(game, {
      dennis: {
        yellow: ['Leonardo Da Vinci'],
        purple: ['Monotheism'],
        hand: ['Gunpowder', 'Enterprise', 'Reformation']
      },
    })
  })

  test('karma: meld yellow', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Leonardo Da Vinci'],
        hand: ['Vaccination', 'Agriculture', 'Services', 'Tools', 'Coal']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Vaccination')

    t.testChoices(request, ['Tools', 'Coal'])

    request = t.choose(game, request, 'auto')

    t.testBoard(game, {
      dennis: {
        yellow: ['Vaccination', 'Leonardo Da Vinci'],
        blue: ['Tools'],
        red: ['Coal'],
        hand: ['Agriculture', 'Services']
      },
    })
  })

  test('karma: non-yellow, non-purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Leonardo Da Vinci'],
        hand: ['Vaccination', 'Agriculture', 'Services', 'Tools', 'Coal']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Coal')

    t.testBoard(game, {
      dennis: {
        yellow: ['Leonardo Da Vinci'],
        red: ['Coal'],
        hand: ['Vaccination', 'Agriculture', 'Services', 'Tools']
      },
    })

  })
})
