Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Watermill", () => {

  test('dogma: no bonus', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Watermill'],
        hand: ['Sailing', 'Fermenting', 'Optics'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Watermill')
    request = t.choose(game, 'Fermenting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Watermill', 'Fermenting'],
        hand: ['Sailing', 'Optics'],
      },
    })
  })

  test('dogma: with bonus', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Crossbow'],
        yellow: ['Watermill'],
        hand: ['Sailing', 'Fermenting'],
      },
      decks: {
        base: {
          3: ['Optics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Watermill')
    request = t.choose(game, 'Fermenting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Crossbow'],
        yellow: ['Watermill', 'Fermenting'],
        hand: ['Sailing', 'Optics'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        forecast: ['Watermill'],
        hand: ['Sailing', 'Fermenting', 'Crossbow'],
      },
      decksExact: {
        base: {
          2: ['Construction', 'Mapmaking'],
          3: ['Optics'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Crossbow')
    request = t.choose(game, 'Fermenting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Crossbow', 'Construction'],
        yellow: ['Watermill', 'Fermenting'],
        green: ['Mapmaking'],
        hand: ['Sailing', 'Optics'],
      },
    })
  })
})
