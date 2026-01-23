Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Speak with Bird', () => {
  test('dogma: win condition - five top cards of value 0', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        purple: ['Speak with Bird'], // Age 0
        red: ['Fire'], // Age 0
        blue: ['Curing'], // Age 0
        green: ['Fishing'], // Age 0
        yellow: ['Fresh Water'], // Age 0
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Speak with Bird')
    // Has exactly 5 top cards, all of value 0
    // Player wins

    t.testGameOver(request, 'dennis', 'Speak with Bird')
  })

  test('dogma: no win - only four top cards of value 0', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        purple: ['Speak with Bird'], // Age 0
        red: ['Fire'], // Age 0
        blue: ['Curing'], // Age 0
        green: ['Fishing'], // Age 0
        // Only 4 top cards, not 5
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Speak with Bird')
    // Has only 4 top cards, not 5
    // No win

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Speak with Bird'],
        red: ['Fire'],
        blue: ['Curing'],
        green: ['Fishing'],
      },
    })
  })

  test('dogma: no win - five top cards but one is not value 0', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        purple: ['Speak with Bird'], // Age 0
        red: ['Fire'], // Age 0
        blue: ['Curing'], // Age 0
        green: ['Fishing'], // Age 0
        yellow: ['Agriculture'], // Age 1, not 0
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Speak with Bird')
    // Has 5 top cards, but Agriculture is age 1, not 0
    // No win

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Speak with Bird'],
        red: ['Fire'],
        blue: ['Curing'],
        green: ['Fishing'],
        yellow: ['Agriculture'],
      },
    })
  })
})
