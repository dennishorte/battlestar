const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wood Workshop (B075)', () => {
  test('gives 1 wood when building improvement', () => {
    const card = res.getCardById('wood-workshop-b075')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onBuildImprovement(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('accumulates wood from multiple improvements', () => {
    const card = res.getCardById('wood-workshop-b075')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3

    card.onBuildImprovement(game, dennis)

    expect(dennis.wood).toBe(4)
  })

  test('requires 1 occupation', () => {
    const card = res.getCardById('wood-workshop-b075')
    expect(card.prereqs.occupations).toBe(1)
  })

  test('costs 1 clay', () => {
    const card = res.getCardById('wood-workshop-b075')
    expect(card.cost).toEqual({ clay: 1 })
  })
})
