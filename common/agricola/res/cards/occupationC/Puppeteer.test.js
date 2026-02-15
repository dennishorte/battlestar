const t = require('../../../testutil_v2.js')

describe('Puppeteer', () => {
  // Card text: "Each time another player uses the 'Traveling Players'
  // accumulation space, you can pay them 1 food to play an occupation."

  test('card exists and has onAnyAction hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['puppeteer-c152'],
      },
    })
    game.run()

    const card = game.cards.byId('puppeteer-c152')
    expect(card).toBeTruthy()
    expect(card.hasHook('onAnyAction')).toBe(true)
  })
})
