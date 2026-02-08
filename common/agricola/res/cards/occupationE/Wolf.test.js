const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wolf (E103)', () => {
  test('initializes pile on play', () => {
    const card = res.getCardById('wolf-e103')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.pile).toEqual(['clay', 'wood', 'grain'])
  })

  test('gives resource and boar when obtaining matching top resource', () => {
    const card = res.getCardById('wolf-e103')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.pile = ['clay', 'wood', 'grain']

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'grain') {
        dennis.grain += amount
      }
    })

    card.onObtainResource(game, dennis, 'grain')

    expect(dennis.addResource).toHaveBeenCalledWith('grain', 1)
    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
    expect(card.pile).toEqual(['clay', 'wood'])
  })

  test('does not trigger when obtaining non-matching resource', () => {
    const card = res.getCardById('wolf-e103')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.pile = ['clay', 'wood', 'grain']

    const dennis = t.player(game)
    dennis.addResource = jest.fn()
    dennis.addAnimals = jest.fn()

    card.onObtainResource(game, dennis, 'wood')

    expect(dennis.addResource).not.toHaveBeenCalled()
    expect(dennis.addAnimals).not.toHaveBeenCalled()
    expect(card.pile).toEqual(['clay', 'wood', 'grain'])
  })

  test('does not give boar when cannot place animals', () => {
    const card = res.getCardById('wolf-e103')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.pile = ['clay', 'wood', 'grain']

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()
    dennis.addResource = jest.fn()

    card.onObtainResource(game, dennis, 'grain')

    expect(dennis.addResource).toHaveBeenCalledWith('grain', 1)
    expect(dennis.addAnimals).not.toHaveBeenCalled()
    expect(card.pile).toEqual(['clay', 'wood'])
  })

  test('does not trigger when pile is empty', () => {
    const card = res.getCardById('wolf-e103')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.pile = []

    const dennis = t.player(game)
    dennis.addResource = jest.fn()
    dennis.addAnimals = jest.fn()

    card.onObtainResource(game, dennis, 'grain')

    expect(dennis.addResource).not.toHaveBeenCalled()
    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
