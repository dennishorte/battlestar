Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Probability', () => {

  test('dogma: 2 biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Probability'],
        hand: ['Legend', 'Optics'],
      },
      decks: {
        base: {
          6: ['Machine Tools', 'Canning', 'Atomic Theory', 'Metric System'],
        },
        usee: {
          6: ['Placebo'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Probability')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Probability'],
        hand: ['Metric System'],
        score: ['Canning', 'Atomic Theory'],
      },
    })
  })

  test('dogma: 3 biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Probability'],
        hand: ['Legend', 'Optics'],
      },
      decks: {
        base: {
          6: ['Industrialization', 'Canning'],
        },
        usee: {
          6: ['Placebo'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Probability')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Probability'],
        hand: ['Canning'],
      },
    })
  })

  test('dogma: 4 biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Probability'],
        hand: ['Legend', 'Optics'],
      },
      decks: {
        base: {
          6: ['Metric System', 'Canning'],
          7: ['Lighting'],
        },
        usee: {
          6: ['Hiking'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Probability')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Probability'],
        hand: ['Canning', 'Lighting'],
      },
    })
  })

})
