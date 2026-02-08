const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Furniture Maker (C116)', () => {
  test('gives 1 wood on play', () => {
    const card = res.getCardById('furniture-maker-c116')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('gives wood equal to food paid when playing occupation', () => {
    const card = res.getCardById('furniture-maker-c116')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.log = { add: jest.fn() }

    card.onPlayOccupation(game, dennis, 3)

    expect(dennis.wood).toBe(3)
  })

  test('gives no wood when no food paid for occupation', () => {
    const card = res.getCardById('furniture-maker-c116')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlayOccupation(game, dennis, 0)

    expect(dennis.wood).toBe(0)
  })
})
