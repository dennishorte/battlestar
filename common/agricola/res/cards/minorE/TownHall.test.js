const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Town Hall (E048)', () => {
  test('gives 1 food during feeding phase with clay house', () => {
    const card = res.getCardById('town-hall-e048')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.roomType = 'clay'

    card.onFeedingPhase(game, dennis)

    expect(dennis.food).toBe(1)
  })

  test('gives 2 food during feeding phase with stone house', () => {
    const card = res.getCardById('town-hall-e048')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.roomType = 'stone'

    card.onFeedingPhase(game, dennis)

    expect(dennis.food).toBe(2)
  })

  test('gives no food with wood house', () => {
    const card = res.getCardById('town-hall-e048')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.roomType = 'wood'

    card.onFeedingPhase(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('has 2 vps', () => {
    const card = res.getCardById('town-hall-e048')
    expect(card.vps).toBe(2)
  })
})
