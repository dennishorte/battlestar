Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Tractor", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Flight'],
        yellow: ['Tractor'],
        hand: ['Candles'],
      },
      decks: {
        base: {
          7: ['Lighting', 'Bicycle', 'Evolution']
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Tractor')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Flight'],
        yellow: ['Tractor'],
        hand: ['Candles', 'Lighting', 'Evolution'],
        score: ['Bicycle'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Flight'],
        forecast: ['Tractor'],
      },
      decks: {
        base: {
          7: [
            'Lighting',
            'Bicycle',
            'Evolution',
            'Combustion',
            'Electricity',
            'Explosives',
            'Publications',
            'Railroad',
            'Refrigeration',
            'Sanitation',
          ]
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Flight')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Flight'],
        yellow: ['Tractor'],
        hand: ['Lighting', 'Evolution'],
        score: [
          'Bicycle',
          'Combustion',
          'Electricity',
          'Explosives',
          'Publications',
          'Railroad',
          'Refrigeration',
          'Sanitation',
        ],
      },
    })
  })
})
