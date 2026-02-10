const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Nest Site', () => {
  test('gives 1 food when reed bank was non-empty', () => {
    const card = res.getCardById('nest-site-a049')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['nest-site-a049'],
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onReedBankReplenish(game, dennis, true)

    expect(dennis.food).toBe(1)
  })

  test('does not give food when reed bank was empty', () => {
    const card = res.getCardById('nest-site-a049')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['nest-site-a049'],
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onReedBankReplenish(game, dennis, false)

    expect(dennis.food).toBe(0)
  })
})
