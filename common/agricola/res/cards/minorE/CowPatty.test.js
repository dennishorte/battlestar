const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cow Patty (E071)', () => {
  test('adds 1 to sow amount when field is adjacent to pasture', () => {
    const card = res.getCardById('cow-patty-e071')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.isFieldAdjacentToPasture = () => true

    const result = card.modifySowAmount(game, dennis, 3, { row: 0, col: 1 })

    expect(result).toBe(4)
  })

  test('does not add to sow amount when field is not adjacent to pasture', () => {
    const card = res.getCardById('cow-patty-e071')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.isFieldAdjacentToPasture = () => false

    const result = card.modifySowAmount(game, dennis, 3, { row: 1, col: 2 })

    expect(result).toBe(3)
  })
})
