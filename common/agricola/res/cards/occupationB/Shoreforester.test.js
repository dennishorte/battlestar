const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Shoreforester (B116)', () => {
  test('gives 1 wood on play', () => {
    const card = res.getCardById('shoreforester-b116')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('gives 1 wood when reed bank is replenished', () => {
    const card = res.getCardById('shoreforester-b116')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onReedBankReplenish(game, dennis)

    expect(dennis.wood).toBe(1)
  })
})
