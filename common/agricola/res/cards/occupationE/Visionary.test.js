const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Visionary (E155)', () => {
  test('gives resources and sets restriction when played in round 4 or before', () => {
    const card = res.getCardById('visionary-e155')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 3

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.vegetables = 0
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'stone') {
        dennis.stone += amount
      }
      else if (type === 'vegetables') {
        dennis.vegetables += amount
      }
    })

    card.onPlay(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('stone', 1)
    expect(dennis.addResource).toHaveBeenCalledWith('vegetables', 1)
    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 2)
    expect(dennis.cannotGrowFamilyUntilRound11).toBe(true)
  })

  test('does not give resources when played after round 4', () => {
    const card = res.getCardById('visionary-e155')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.addResource = jest.fn()
    dennis.addAnimals = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addResource).not.toHaveBeenCalled()
    expect(dennis.addAnimals).not.toHaveBeenCalled()
    expect(dennis.cannotGrowFamilyUntilRound11).toBeUndefined()
  })

  test('allows family growth in round 11 or later', () => {
    const card = res.getCardById('visionary-e155')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 11

    const mockPlayer = {
      cannotGrowFamilyUntilRound11: true,
    }

    expect(card.canGrowFamily(mockPlayer, game)).toBe(true)
  })

  test('allows family growth before round 11 if all others have grown', () => {
    const card = res.getCardById('visionary-e155')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 8

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.cannotGrowFamilyUntilRound11 = true
    micah.getFamilySize = () => 3

    expect(card.canGrowFamily(dennis, game)).toBe(true)
  })

  test('does not allow family growth before round 11 if not all others have grown', () => {
    const card = res.getCardById('visionary-e155')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 8

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.cannotGrowFamilyUntilRound11 = true
    micah.getFamilySize = () => 2

    expect(card.canGrowFamily(dennis, game)).toBe(false)
  })

  test('always allows family growth if restriction not set', () => {
    const card = res.getCardById('visionary-e155')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 5

    const mockPlayer = {
      cannotGrowFamilyUntilRound11: false,
    }

    expect(card.canGrowFamily(mockPlayer, game)).toBe(true)
  })
})
