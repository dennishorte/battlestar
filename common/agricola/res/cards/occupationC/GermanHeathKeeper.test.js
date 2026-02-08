const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('German Heath Keeper (C164)', () => {
  test('gives 1 sheep when any player uses take-boar action', () => {
    const card = res.getCardById('german-heath-keeper-c164')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => true
    game.log = { add: jest.fn() }

    card.onAnyAction(game, micah, 'take-boar', dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 1)
  })

  test('gives sheep when card owner uses take-boar action', () => {
    const card = res.getCardById('german-heath-keeper-c164')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => true
    game.log = { add: jest.fn() }

    card.onAnyAction(game, dennis, 'take-boar', dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 1)
  })

  test('does not give sheep when player cannot place animals', () => {
    const card = res.getCardById('german-heath-keeper-c164')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => false

    card.onAnyAction(game, micah, 'take-boar', dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('german-heath-keeper-c164')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.addAnimals = jest.fn()
    dennis.canPlaceAnimals = () => true

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
