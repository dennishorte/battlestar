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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Coal')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Coal', 'Archery'],
        blue: ['Tools'],
        green: ['Navigation', 'The Wheel'],
        hand: ['Sailing', 'Enterprise', 'Calendar', 'Astronomy'],
        museum: ['Museum 1', 'Hunt-Lennox Globe'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Experimentation')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Construction', 'Archery'],
        blue: ['Experimentation', 'Mathematics', 'Tools'],
        green: ['Navigation', 'The Wheel'],
        hand: ['Sailing', 'Enterprise', 'Calendar'],
        museum: ['Museum 1', 'Hunt-Lennox Globe'],
      },
    })
  })
})
