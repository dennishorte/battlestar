const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mayor Candidate (E124)', () => {
  test('gives 2 wood and 2 stone on play', () => {
    const card = res.getCardById('mayor-candidate-e124')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.stone = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'wood') {
        dennis.wood += amount
      }
      else if (type === 'stone') {
        dennis.stone += amount
      }
    })

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 2)
    expect(dennis.addResource).toHaveBeenCalledWith('stone', 2)
    expect(dennis.cannotDiscardWoodOrStone).toBe(true)
  })

  test('gives negative points equal to wood and stone in supply', () => {
    const card = res.getCardById('mayor-candidate-e124')

    const mockPlayer = {
      wood: 3,
      stone: 2,
    }

    const points = card.getEndGamePoints(mockPlayer)

    expect(points).toBe(-5)
  })

  test('gives no penalty when no wood or stone in supply', () => {
    const card = res.getCardById('mayor-candidate-e124')

    const mockPlayer = {
      wood: 0,
      stone: 0,
    }

    const points = card.getEndGamePoints(mockPlayer)

    // -0 and 0 are equivalent for scoring purposes
    expect(points + 0).toBe(0)
  })
})
