const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Potato Digger (C161)', () => {
  test('gives 3 vegetables when 5+ unplanted fields', () => {
    const card = res.getCardById('potato-digger-c161')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.getUnplantedFieldCount = () => 5
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.vegetables).toBe(3)
  })

  test('gives 2 vegetables when 4 unplanted fields', () => {
    const card = res.getCardById('potato-digger-c161')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.getUnplantedFieldCount = () => 4
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.vegetables).toBe(2)
  })

  test('gives 1 vegetable when 2-3 unplanted fields', () => {
    const card = res.getCardById('potato-digger-c161')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.getUnplantedFieldCount = () => 2
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.vegetables).toBe(1)
  })

  test('gives no vegetables when less than 2 unplanted fields', () => {
    const card = res.getCardById('potato-digger-c161')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.getUnplantedFieldCount = () => 1

    card.onPlay(game, dennis)

    expect(dennis.vegetables).toBe(0)
  })

  test('gives no vegetables when no unplanted fields', () => {
    const card = res.getCardById('potato-digger-c161')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.getUnplantedFieldCount = () => 0

    card.onPlay(game, dennis)

    expect(dennis.vegetables).toBe(0)
  })
})
