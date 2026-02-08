const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Chairman (OccD 139)', () => {
  test('gives 1 food to card owner when they use meeting place', () => {
    const card = res.getCardById('chairman-d139')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAnyAction(game, dennis, 'meeting-place', dennis)

    expect(dennis.food).toBe(1)
  })

  test('gives 1 food to both players when another player uses meeting place', () => {
    const card = res.getCardById('chairman-d139')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 0

    card.onAnyAction(game, micah, 'meeting-place', dennis)

    expect(dennis.food).toBe(1)
    expect(micah.food).toBe(1)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('chairman-d139')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 0

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.food).toBe(0)
    expect(micah.food).toBe(0)
  })
})
