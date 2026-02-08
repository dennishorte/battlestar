const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pickler (E135)', () => {
  test('gives 4 wood when 9+ rounds left', () => {
    const card = res.getCardById('pickler-e135')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 5 // 9 rounds left

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'wood') {
        dennis.wood += amount
      }
    })

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 4)
  })

  test('gives 3 wood when 6-8 rounds left', () => {
    const card = res.getCardById('pickler-e135')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 8 // 6 rounds left

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 3)
  })

  test('gives 2 wood when 3-5 rounds left', () => {
    const card = res.getCardById('pickler-e135')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 11 // 3 rounds left

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 2)
  })

  test('gives 1 wood when 1-2 rounds left', () => {
    const card = res.getCardById('pickler-e135')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 13 // 1 round left

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 1)
  })

  test('gives end game points to players with most vegetables', () => {
    const card = res.getCardById('pickler-e135')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.getTotalVegetables = () => 5
    micah.getTotalVegetables = () => 3

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(3)
    expect(bonuses.micah).toBeUndefined()
  })

  test('gives end game points to tied players with most vegetables', () => {
    const card = res.getCardById('pickler-e135')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.getTotalVegetables = () => 5
    micah.getTotalVegetables = () => 5

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(3)
    expect(bonuses.micah).toBe(3)
  })
})
