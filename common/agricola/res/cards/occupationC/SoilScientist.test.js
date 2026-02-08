const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Soil Scientist (C114)', () => {
  test('offers stone exchange when using take-clay with stone', () => {
    const card = res.getCardById('soil-scientist-c114')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 2
    game.actions = { offerSoilScientistExchange: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerSoilScientistExchange).toHaveBeenCalledWith(
      dennis,
      card,
      'stone',
      1,
      'grain',
      2,
      'take-clay'
    )
  })

  test('offers stone exchange when using take-clay-2 with stone', () => {
    const card = res.getCardById('soil-scientist-c114')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 1
    game.actions = { offerSoilScientistExchange: jest.fn() }

    card.onAction(game, dennis, 'take-clay-2')

    expect(game.actions.offerSoilScientistExchange).toHaveBeenCalledWith(
      dennis,
      card,
      'stone',
      1,
      'grain',
      2,
      'take-clay-2'
    )
  })

  test('offers clay exchange when using take-stone-1 with clay', () => {
    const card = res.getCardById('soil-scientist-c114')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 3
    dennis.stone = 0
    game.actions = { offerSoilScientistExchange: jest.fn() }

    card.onAction(game, dennis, 'take-stone-1')

    expect(game.actions.offerSoilScientistExchange).toHaveBeenCalledWith(
      dennis,
      card,
      'clay',
      2,
      'vegetables',
      1,
      'take-stone-1'
    )
  })

  test('offers clay exchange when using take-stone-2 with clay', () => {
    const card = res.getCardById('soil-scientist-c114')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 2
    dennis.stone = 0
    game.actions = { offerSoilScientistExchange: jest.fn() }

    card.onAction(game, dennis, 'take-stone-2')

    expect(game.actions.offerSoilScientistExchange).toHaveBeenCalledWith(
      dennis,
      card,
      'clay',
      2,
      'vegetables',
      1,
      'take-stone-2'
    )
  })

  test('does not offer exchange when player lacks stone on clay action', () => {
    const card = res.getCardById('soil-scientist-c114')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.clay = 5
    game.actions = { offerSoilScientistExchange: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerSoilScientistExchange).not.toHaveBeenCalled()
  })

  test('does not offer exchange when player lacks clay on stone action', () => {
    const card = res.getCardById('soil-scientist-c114')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 1
    dennis.stone = 5
    game.actions = { offerSoilScientistExchange: jest.fn() }

    card.onAction(game, dennis, 'take-stone-1')

    expect(game.actions.offerSoilScientistExchange).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('soil-scientist-c114')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 5
    dennis.stone = 5
    game.actions = { offerSoilScientistExchange: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerSoilScientistExchange).not.toHaveBeenCalled()
  })
})
