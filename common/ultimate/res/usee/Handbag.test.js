Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Handbag', () => {

  test('dogma: Transfer bottom cards to hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Handbag', 'The Wheel'],
        red: ['Oars', 'Flight'],
        score: ['Tools', 'Optics'],
        hand: ['Canning', 'Experimentation']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Handbag')
    request = t.choose(game, 'Transfer bottom cards to hand')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Handbag'],
        red: ['Oars'],
        score: ['Tools', 'Optics'],
        hand: ['Canning', 'Experimentation', 'The Wheel', 'Flight']
      },
    })
  })

  test('dogma: Tuck score pile', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Handbag', 'The Wheel'],
        red: ['Oars', 'Flight'],
        score: ['Tools', 'Optics'],
        hand: ['Canning', 'Experimentation']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Handbag')
    request = t.choose(game, 'Tuck score pile')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Handbag', 'The Wheel'],
        red: ['Oars', 'Flight', 'Optics'],
        blue: ['Tools'],
        hand: ['Canning', 'Experimentation']
      },
    })
  })

  test('dogma: Score cards of chosen value from hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Handbag', 'The Wheel'],
        red: ['Oars', 'Flight'],
        score: ['Tools', 'Optics'],
        hand: ['Canning', 'Experimentation']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Handbag')
    request = t.choose(game, 'Score cards of chosen value from hand')
    request = t.choose(game, 6)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Handbag', 'The Wheel'],
        red: ['Oars', 'Flight'],
        score: ['Tools', 'Optics', 'Canning'],
        hand: ['Experimentation']
      },
    })
  })

})
