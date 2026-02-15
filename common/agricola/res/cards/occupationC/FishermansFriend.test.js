const t = require('../../../testutil_v2.js')

describe("Fisherman's Friend", () => {
  // Card text: "At the start of each round, if there is more food on 'Traveling Players'
  // than on 'Fishing' accumulation space, you get the difference."

  test('card exists and has onRoundStart hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['fishermans-friend-c159'],
      },
    })
    game.run()

    const card = game.cards.byId('fishermans-friend-c159')
    expect(card).toBeTruthy()
    expect(card.hasHook('onRoundStart')).toBe(true)
  })
})
