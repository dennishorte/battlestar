const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Alchemist\'s Lab (E081)', () => {
  test('is an action space', () => {
    const card = res.getCardById('alchemists-lab-e081')
    expect(card.isActionSpace).toBe(true)
  })

  test('gives building resources to player who already has them (owner)', () => {
    const card = res.getCardById('alchemists-lab-e081')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 2
    dennis.clay = 1
    dennis.stone = 0
    dennis.reed = 3

    card.actionSpaceEffect(game, dennis, dennis)

    expect(dennis.wood).toBe(3)
    expect(dennis.clay).toBe(2)
    expect(dennis.stone).toBe(0)
    expect(dennis.reed).toBe(4)
  })

  test('requires other player to pay 1 food to owner', () => {
    const card = res.getCardById('alchemists-lab-e081')
    const game = t.fixture({ cardSets: ['minorE'], numPlayers: 2 })
    game.run()

    const dennis = t.player(game, 'dennis')
    const micah = t.player(game, 'micah')
    dennis.food = 3
    micah.food = 5
    micah.wood = 1
    micah.clay = 0
    micah.stone = 0
    micah.reed = 0

    card.actionSpaceEffect(game, micah, dennis)

    expect(micah.food).toBe(4)
    expect(dennis.food).toBe(4)
    expect(micah.wood).toBe(2)
  })
})
