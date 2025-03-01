Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alex Trebek', () => {
  test('inspire AND karma', () => {
    const game = t.fixtureTopCard('Alex Trebek', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 9, ['Ecology', 'Computers'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')
    request = t.choose(game, request, 9)
    request = t.choose(game, request, 'Ruth Handler')
    // Ecology covers Alex, so no trigger when doing inspire draw; also, only draw a 9.

    t.testIsSecondPlayer(game)
    t.testZone(game, 'yellow', ['Ecology', 'Alex Trebek'])
    t.testZone(game, 'hand', ['Ruth Handler', 'Computers'], { sort: true })
  })
})
