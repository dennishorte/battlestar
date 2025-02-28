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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Leonardo Da Vinci')

    t.testChoices(request2, ['Homer', 'Leonardo Da Vinci'])

    const request3 = t.choose(game, request2, 'Homer')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Monotheism')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Vaccination')

    t.testChoices(request2, ['Tools', 'Coal'])

    const request3 = t.choose(game, request2, 'auto')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Coal')

    t.testBoard(game, {
      dennis: {
        yellow: ['Leonardo Da Vinci'],
        red: ['Coal'],
        hand: ['Vaccination', 'Agriculture', 'Services', 'Tools']
      },
    })

  })
})
