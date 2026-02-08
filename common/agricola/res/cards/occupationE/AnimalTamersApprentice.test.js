const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Animal Tamer's Apprentice (E168)", () => {
  test('gives sheep for unoccupied wood rooms', () => {
    const card = res.getCardById('animal-tamers-apprentice-e168')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getUnoccupiedRoomsByType = (type) => {
      if (type === 'wood') {
        return 2
      }
      return 0
    }
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onRoundStart(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 2)
  })

  test('gives boar for unoccupied clay rooms', () => {
    const card = res.getCardById('animal-tamers-apprentice-e168')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getUnoccupiedRoomsByType = (type) => {
      if (type === 'clay') {
        return 1
      }
      return 0
    }
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onRoundStart(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
  })

  test('gives cattle for unoccupied stone rooms', () => {
    const card = res.getCardById('animal-tamers-apprentice-e168')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getUnoccupiedRoomsByType = (type) => {
      if (type === 'stone') {
        return 3
      }
      return 0
    }
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onRoundStart(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('cattle', 3)
  })

  test('does not give animals if cannot place them', () => {
    const card = res.getCardById('animal-tamers-apprentice-e168')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getUnoccupiedRoomsByType = (type) => {
      if (type === 'wood') {
        return 2
      }
      return 0
    }
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()

    card.onRoundStart(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
