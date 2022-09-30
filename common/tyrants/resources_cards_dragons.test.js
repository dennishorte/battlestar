Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Dragons Expansion Cards', () => {

  describe('Dragon Cultist', () => {
    test('Choose power', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragon Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragon Cultist')
      const request3 = t.choose(game, request2, '+2 power')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Dragon Cultist'],
          power: 2,
        }
      })
    })

    test('Choose influence', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Dragon Cultist'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Dragon Cultist')
      const request3 = t.choose(game, request2, '+2 influence')

      t.testBoard(game, {
        dennis: {
          hand: [],
          played: ['Dragon Cultist'],
          influence: 2,
        }
      })
    })
  })

})
