Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Dead Sea Scrolls', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Dead Sea Scrolls'],
        blue: ['Mathematics', 'Calendar'],
      },
      achievements: ['Sailing', 'Construction', 'Machinery'],
      decks: {
        arti: {
          2: ['Holy Grail'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'dennis')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics', 'Calendar'],
        hand: ['Holy Grail'],
        museum: ['Museum 1', 'Dead Sea Scrolls'],
      },
    })

    expect(game.cards.byZone('junk').findIndex(card => card.name === 'Construction')).not.toBe(-1)
    expect(game.cards.byZone('junk').length).toBeGreaterThan(1)
  })
})
