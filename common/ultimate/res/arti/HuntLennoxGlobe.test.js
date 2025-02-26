Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hunt-Lennox Globe', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Hunt-Lennox Globe'],
        red: ['Construction', 'Archery'],
        blue: ['Mathematics', 'Tools'],
        green: ['Navigation', 'The Wheel'],
        hand: ['Sailing', 'Enterprise', 'Calendar']
      },
      decks: {
        base: {
          5: ['Astronomy', 'Coal']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'Coal')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        red: ['Coal', 'Archery'],
        blue: ['Tools'],
        green: ['Navigation', 'The Wheel'],
        hand: ['Sailing', 'Enterprise', 'Calendar', 'Astronomy']
      },
    })
  })

  test('dogma: four cards in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Hunt-Lennox Globe'],
        red: ['Construction', 'Archery'],
        blue: ['Mathematics', 'Tools'],
        green: ['Navigation', 'The Wheel'],
        hand: ['Sailing', 'Enterprise', 'Calendar', 'Experimentation']
      },
      decks: {
        base: {
          5: ['Astronomy', 'Coal']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Experimentation')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Construction', 'Archery'],
        blue: ['Experimentation', 'Mathematics', 'Tools'],
        green: ['Navigation', 'The Wheel'],
        hand: ['Sailing', 'Enterprise', 'Calendar']
      },
    })
  })
})
