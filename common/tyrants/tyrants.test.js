Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Tyrants', () => {

  test('game initializes', () => {
    const game = t.fixture()
    const request1 = game.run()
  })

  test('deploy a troop', () => {
    const game = t.gameFixture({
      dennis: {
        power: 1,
      }
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Use Power.Deploy a Troop')
    const request3 = t.choose(game, request2, 'ched-llace a')

    t.testTroops(game, 'ched-llace a', ['dennis'])
  })
})
