const t = require('../../../testutil_v2.js')

describe('Cow Prince', () => {
  // Card text: "During scoring, you get 1 BP for each space in your farmyard
  // holding at least 1 cattle."

  test('card exists and has getEndGamePoints hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['cow-prince-c134'],
      },
    })
    game.run()

    const card = game.cards.byId('cow-prince-c134')
    expect(card).toBeTruthy()
    expect(card.hasHook('getEndGamePoints')).toBe(true)
  })
})
