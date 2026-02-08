const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Master Huntsman (E165)', () => {
  test('gives 1 wild boar on play if can place animals', () => {
    const card = res.getCardById('master-huntsman-e165')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
  })

  test('does not give wild boar on play if cannot place animals', () => {
    const card = res.getCardById('master-huntsman-e165')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('gives 1 wild boar when building major improvement if can place animals', () => {
    const card = res.getCardById('master-huntsman-e165')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    card.onBuildMajor(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
  })

  test('does not give wild boar when building major if cannot place animals', () => {
    const card = res.getCardById('master-huntsman-e165')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()

    card.onBuildMajor(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
