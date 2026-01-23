Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fermi Paradox', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Fermi Paradox'],
      },
      junk: ['Monument', 'Tools', 'Optics'],
      decks: {
        base: {
          9: ['Specialization'],
          10: ['Software', 'Robotics'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fermi Paradox')
    request = t.choose(game, 'Software')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Fermi Paradox'],
        hand: ['Tools', 'Optics'],
      },
    })

    expect(game.zones.byDeck('base', 10).cardlist()[0].name).toBe('Robotics')
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee', 'arti'] })
    t.setBoard(game, {
      dennis: {
        artifact: ['Fermi Paradox'],
      },
      decks: {
        base: {
          9: ['Specialization'],
          10: ['Software', 'Robotics'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Software')

    t.testGameOver(request, 'dennis', 'Fermi Paradox')
  })

})
