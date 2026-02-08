const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bumper Crop (E025)', () => {
  test('triggers field harvest on play', () => {
    const card = res.getCardById('bumper-crop-e025')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let harvestCalled = false
    game.actions.harvestFields = (player) => {
      harvestCalled = true
      expect(player).toBe(dennis)
    }

    card.onPlay(game, dennis)

    expect(harvestCalled).toBe(true)
  })
})
