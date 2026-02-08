const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sheep Provider (C141)', () => {
  test('gives 1 grain when any player uses take-sheep action', () => {
    const card = res.getCardById('sheep-provider-c141')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.grain = 0
    game.log = { add: jest.fn() }

    card.onAnyAction(game, micah, 'take-sheep', dennis)

    expect(dennis.grain).toBe(1)
  })

  test('gives grain when card owner uses take-sheep action', () => {
    const card = res.getCardById('sheep-provider-c141')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.log = { add: jest.fn() }

    card.onAnyAction(game, dennis, 'take-sheep', dennis)

    expect(dennis.grain).toBe(1)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('sheep-provider-c141')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.grain = 0

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.grain).toBe(0)
  })
})
