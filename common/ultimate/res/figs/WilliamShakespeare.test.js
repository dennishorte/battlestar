Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('William Shakespeare', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('William Shakespeare', 'Rivalry')
  })

  test('karma: decree for any three', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['William Shakespeare'],
        hand: ['Sargon of Akkad', 'Niccolo Machiavelli', 'Yi Sun-Sin'],
      },
    })

    let request
    request = game.run()
    expect(t.getChoices(request, 'Decree').sort())
      .toEqual(['War', 'Trade', 'Advancement', 'Expansion', 'Rivalry'].sort())
  })
})
