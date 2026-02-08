const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Millwright (OccD 088)', () => {
  test('gives 1 grain on play', () => {
    const card = res.getCardById('millwright-d088')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('has allowsGrainSubstitution flag', () => {
    const card = res.getCardById('millwright-d088')
    expect(card.allowsGrainSubstitution).toBe(true)
  })

  test('has maxSubstitutions of 2', () => {
    const card = res.getCardById('millwright-d088')
    expect(card.maxSubstitutions).toBe(2)
  })
})
