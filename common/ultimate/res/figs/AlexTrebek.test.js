Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alex Trebek', () => {
  test('inspire AND karma', () => {
    const game = t.fixtureTopCard('Alex Trebek', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 9, ['Ecology', 'Computers'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 9)
    const request4 = t.choose(game, request3, 'Ruth Handler')
    // Ecology covers Alex, so no trigger when doing inspire draw; also, only draw a 9.

    t.testIsSecondPlayer(game)
    t.testZone(game, 'yellow', ['Ecology', 'Alex Trebek'])
    t.testZone(game, 'hand', ['Ruth Handler', 'Computers'], { sort: true })
  })
})
