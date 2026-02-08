const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bed in the Grain Field (C024)', () => {
  test('sets bedInGrainFieldNextHarvest flag on play', () => {
    const card = res.getCardById('bed-in-the-grain-field-c024')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    expect(dennis.bedInGrainFieldNextHarvest).toBeFalsy()

    card.onPlay(game, dennis)

    expect(dennis.bedInGrainFieldNextHarvest).toBe(true)
  })

  test('has onPlay hook', () => {
    const card = res.getCardById('bed-in-the-grain-field-c024')
    expect(card.onPlay).toBeDefined()
  })

  test('requires 1 grain field as prereq', () => {
    const card = res.getCardById('bed-in-the-grain-field-c024')
    expect(card.prereqs.grainFields).toBe(1)
  })
})
