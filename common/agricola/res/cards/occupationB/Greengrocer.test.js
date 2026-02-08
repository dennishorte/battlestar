const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Greengrocer (B142)', () => {
  test('gives 1 vegetable when using Grain Seeds action', () => {
    const card = res.getCardById('greengrocer-b142')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onAction(game, dennis, 'take-grain')

    expect(dennis.vegetables).toBe(1)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('greengrocer-b142')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.vegetables).toBe(0)
  })
})
