const t = require('../../../testutil_v2.js')

describe('Green Grocer', () => {
  // Card text: "At the start of each round, you can make exactly one exchange."

  test('card exists and has onRoundStart hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['green-grocer-c103'],
      },
    })
    game.run()

    const card = game.cards.byId('green-grocer-c103')
    expect(card).toBeTruthy()
    expect(card.hasHook('onRoundStart')).toBe(true)
  })
})
