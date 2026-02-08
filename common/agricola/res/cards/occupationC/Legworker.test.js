const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Legworker (C117)', () => {
  test('gives 1 wood when action space is adjacent to own worker', () => {
    const card = res.getCardById('legworker-c117')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.isAdjacentToOwnWorker = () => true
    game.log = { add: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(1)
  })

  test('does not give wood when not adjacent to own worker', () => {
    const card = res.getCardById('legworker-c117')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.isAdjacentToOwnWorker = () => false

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(0)
  })
})
