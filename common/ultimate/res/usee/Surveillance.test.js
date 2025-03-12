Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Surveillance', () => {

  test('dogma: empty hands', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Surveillance'],
      },
      decks: {
        usee: {
          10: ['Fight Club'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Surveillance')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Surveillance'],
        hand: ['Fight Club'],
      },
    })
  })

  test('dogma: colors match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Surveillance'],
        hand: ['Tools', 'The Wheel', 'Paper'],
      },
      micah: {
        hand: ['Experimentation', 'Metric System'],
      },
      decks: {
        usee: {
          10: ['Fight Club'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Surveillance')

    t.testGameOver(request, 'dennis', 'Surveillance')
  })

  test('dogma: mismatch', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Surveillance'],
        hand: ['Tools', 'The Wheel', 'Paper'],
      },
      micah: {
        hand: ['Experimentation'],
      },
      decks: {
        usee: {
          10: ['Fight Club'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Surveillance')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Surveillance'],
        hand: ['Fight Club', 'Tools', 'The Wheel', 'Paper'],
      },
      micah: {
        hand: ['Experimentation'],
      },
    })
  })

})
