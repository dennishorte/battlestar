Error.stackTraceLimit = 100

const {
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const t = require('./testutil.js')


describe('Tyrants Cards', () => {

  describe('Core', () => {

    test('House Guard', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['House Guard'],
        }
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.House Guard')

      expect(t.dennis(game).power).toBe(2)
    })

    test('Priestess of Lolth', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Priestess of Lolth'],
        }
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Priestess of Lolth')

      expect(t.dennis(game).influence).toBe(2)
    })

    describe('Insane Outcast', () => {
      test('play', () => {
        const game = t.gameFixture({
          dennis: {
            hand: ['House Guard', 'Insane Outcast'],
          }
        })

        const request1 = game.run()
        const request2 = t.choose(game, request1, 'Play Card.Insane Outcast')
        const request3 = t.choose(game, request2, 'House Guard')

        t.testBoard(game, {
          dennis: {
            played: [],
            discard: ['House Guard'],
          }
        })
      })

      test.skip('devour', () => {

      })

      test.skip('promote', () => {

      })
    })

  })
})
