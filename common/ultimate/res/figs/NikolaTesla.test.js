Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Nikola Tesla', () => {


  test('karma: decree', () => {
    t.testDecreeForTwo('Nikola Tesla', 'Expansion')
  })

  test('karma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Nikola Tesla'],
        hand: ['Writing']
      },
      micah: {
        yellow: ['Canning'],
        purple: ['Mysticism'],
        blue: ['Tools'],
        green: ['Databases']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Writing')

    t.testChoices(request, ['Canning', 'Mysticism'])

    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Nikola Tesla'],
        blue: ['Writing'],
        score: ['Canning'],
      },
      micah: {
        purple: ['Mysticism'],
        blue: ['Tools'],
        green: ['Databases']
      },
    })
  })
})
