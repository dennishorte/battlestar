const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Kindling Gatherer (E118)', () => {
  test('gives 1 wood when action space gives food', () => {
    const card = res.getCardById('kindling-gatherer-e118')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.actionSpaceGivesFood = () => true

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'wood') {
        dennis.wood += amount
      }
    })

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 1)
  })

  test('does not give wood when action space does not give food', () => {
    const card = res.getCardById('kindling-gatherer-e118')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.actionSpaceGivesFood = () => false

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'forest')

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
