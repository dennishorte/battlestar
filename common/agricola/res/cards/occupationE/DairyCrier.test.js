const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Dairy Crier (E167)', () => {
  test('offers choice to all players and gives cattle to owner', () => {
    const card = res.getCardById('dairy-crier-e167')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => true
    dennis.addAnimals = jest.fn()

    const offerDairyCrierChoice = jest.fn()
    game.actions.offerDairyCrierChoice = offerDairyCrierChoice

    card.onPlay(game, dennis)

    expect(offerDairyCrierChoice).toHaveBeenCalledWith(game.players.all())
    expect(dennis.addAnimals).toHaveBeenCalledWith('cattle', 1)
  })

  test('does not give cattle if cannot place animals', () => {
    const card = res.getCardById('dairy-crier-e167')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = () => false
    dennis.addAnimals = jest.fn()

    game.actions.offerDairyCrierChoice = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
