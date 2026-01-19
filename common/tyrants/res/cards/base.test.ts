Error.stackTraceLimit = 100

import t from '../../testutil.js'


describe('Core Cards', () => {

  test('House Guard', () => {
    const game = t.gameFixture({
      dennis: {
        hand: ['House Guard'],
      }
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Play Card.House Guard')

    t.testBoard(game, {
      dennis: {
        hand: [],
        played: ['House Guard'],
        power: 2,
      }
    })
  })

  test('Priestess of Lolth', () => {
    const game = t.gameFixture({
      dennis: {
        hand: ['Priestess of Lolth'],
      }
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Play Card.Priestess of Lolth')

    t.testBoard(game, {
      dennis: {
        hand: [],
        played: ['Priestess of Lolth'],
        influence: 2,
      }
    })
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

    test('promote', () => {
      const game = t.gameFixture({
        dennis: {
          hand: ['Insane Outcast', 'Drow Negotiator'],
        }
      })

      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Play Card.Insane Outcast')
      const request3 = t.choose(game, request2)
      const request4 = t.choose(game, request3, 'Play Card.Drow Negotiator')

      t.testBoard(game, {
        dennis: {
          discard: ['Drow Negotiator'],
        }
      })
    })
  })

})
