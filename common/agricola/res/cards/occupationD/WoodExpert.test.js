const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wood Expert (OccD 117)', () => {
  test('gives 2 wood on play', () => {
    const card = res.getCardById('wood-expert-d117')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('has allowsFoodForWoodSubstitution flag', () => {
    const card = res.getCardById('wood-expert-d117')
    expect(card.allowsFoodForWoodSubstitution).toBe(true)
  })

  test('has maxWoodSubstitution of 2', () => {
    const card = res.getCardById('wood-expert-d117')
    expect(card.maxWoodSubstitution).toBe(2)
  })
})
